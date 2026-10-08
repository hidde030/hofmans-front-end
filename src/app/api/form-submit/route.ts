import { NextResponse } from 'next/server';

import { useDirectus } from '@/lib/directus/directus';
import { issueFormChallenge, verifyFormChallenge } from '@/lib/security/form-protection';
import { rateLimit } from '@/lib/security/rate-limit';
import { buildZodSchema } from '@/lib/zodSchemaBuilder';
import type { Form, FormField, FormSubmission, FormSubmissionValue } from '@/types/directus-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Honeypot field name. Hidden from real users, but bots autofill every text
 * input they find. If this field arrives with a value, the submission is
 * silently dropped. Keep this name out of your Directus form definitions.
 */
const HONEYPOT_FIELD = 'website';

const MAX_FIELD_LENGTH = Number(process.env.FORM_MAX_FIELD_LENGTH) || 10_000;

/** Issues a signed challenge token when a form is rendered. */
export async function GET() {
	const challenge = issueFormChallenge();

	if (!challenge) {
		return NextResponse.json({ error: 'Form protection is not configured.' }, { status: 500 });
	}

	return NextResponse.json(challenge);
}

type FormWithFields = Pick<Form, 'id' | 'is_active'> & { fields: FormField[] | null };

function getClientIp(request: Request): string {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0]?.trim() || 'unknown';
	}

	return request.headers.get('x-real-ip') || 'unknown';
}

function coerceValue(type: FormField['type'], formData: FormData, name: string): unknown {
	switch (type) {
		case 'checkbox': {
			const value = formData.get(name);

			return value === 'true';
		}
		case 'checkbox_group':
			return formData.getAll(name).map((value) => String(value));
		case 'file':
			return formData.get(name) ?? undefined;
		default:
			return formData.get(name) ?? '';
	}
}

function looksLikeSpam(fields: FormField[], data: Record<string, unknown>): boolean {
	let totalUrls = 0;

	for (const field of fields) {
		const name = field.name;
		if (!name) continue;

		const value = data[name];
		if (Array.isArray(value)) {
			for (const item of value) {
				if (typeof item === 'string') {
					totalUrls += (item.match(/https?:\/\/|www\./i) || []).length;
				}
			}
			continue;
		}

		if (typeof value !== 'string') continue;

		const urls = (value.match(/https?:\/\/|www\./i) || []).length;
		totalUrls += urls;

		// URLs inside name-like fields are a strong spam signal.
		if (urls > 0 && /name|naam|voornaam|achternaam|first|last/i.test(name)) {
			return true;
		}
	}

	return totalUrls >= 3;
}

export async function POST(request: Request) {
	const ip = getClientIp(request);

	// Rate limit per IP before doing any work.
	const limitResult = rateLimit(ip);
	if (!limitResult.allowed) {
		return NextResponse.json(
			{ error: 'Too many submissions. Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(Math.ceil((limitResult.retryAfterMs ?? 60_000) / 1000)) } },
		);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 });
	}

	// Honeypot: a real user never fills this hidden field.
	const honeypot = formData.get(HONEYPOT_FIELD);
	if (honeypot && String(honeypot).trim() !== '') {
		// Pretend success so bots don't know they were filtered.
		return NextResponse.json({ ok: true });
	}

	// Challenge: signed timestamp proving the form wasn't submitted instantly.
	const token = formData.get('_token');
	if (!verifyFormChallenge(typeof token === 'string' ? token : null)) {
		return NextResponse.json(
			{ error: 'Form validation failed. Please refresh the page and try again.' },
			{ status: 400 },
		);
	}

	const formId = formData.get('formId');
	if (!formId || typeof formId !== 'string') {
		return NextResponse.json({ error: 'Invalid form.' }, { status: 400 });
	}

	const { directus, readItem, createItem, uploadFiles, withToken } = useDirectus();
	const FORM_TOKEN = process.env.DIRECTUS_FORM_TOKEN;

	if (!FORM_TOKEN) {
		return NextResponse.json({ error: 'Form submission is not configured.' }, { status: 500 });
	}

	let form: FormWithFields;
	try {
		form = (await directus.request(
			readItem('forms', formId, {
				fields: [
					'id',
					'is_active',
					{
						fields: ['id', 'name', 'type', 'label', 'validation', 'required', 'choices', 'sort'],
					},
				],
			}),
		)) as FormWithFields;
	} catch {
		return NextResponse.json({ error: 'Form not found.' }, { status: 404 });
	}

	if (!form || form.is_active !== true || !Array.isArray(form.fields)) {
		return NextResponse.json({ error: 'Form not found.' }, { status: 404 });
	}

	// Rebuild submitted values keyed by the *real* field names, then validate
	// them server-side against the form's own schema.
	const rawValues: Record<string, unknown> = {};
	for (const field of form.fields) {
		if (!field.name || field.type === 'hidden') continue;
		rawValues[field.name] = coerceValue(field.type, formData, field.name);

		// Hard cap on field length to reject oversized junk.
		const value = rawValues[field.name];
		if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
			return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
		}
	}

	const schema = buildZodSchema(form.fields);
	const parsed = schema.safeParse(rawValues);

	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
	}

	const values = parsed.data as Record<string, unknown>;

	if (looksLikeSpam(form.fields, values)) {
		// Drop obvious spam silently.
		return NextResponse.json({ ok: true });
	}

	// Build the Directus form_submissions payload.
	const submissionValues: Omit<FormSubmissionValue, 'id'>[] = [];

	for (const field of form.fields) {
		if (!field.name || field.type === 'hidden') continue;

		const value = values[field.name];
		if (value === undefined || value === null) continue;

		if (field.type === 'file' && value instanceof File) {
			const uploadFormData = new FormData();
			uploadFormData.append('file', value);

			const uploadedFile = await directus.request(withToken(FORM_TOKEN, uploadFiles(uploadFormData)));

			if (uploadedFile && 'id' in uploadedFile) {
				submissionValues.push({ field: field.id, file: uploadedFile.id });
			}
		} else if (field.type === 'checkbox_group' && Array.isArray(value)) {
			for (const item of value) {
				submissionValues.push({ field: field.id, value: String(item) });
			}
		} else if (field.type === 'checkbox') {
			submissionValues.push({ field: field.id, value: value ? 'true' : 'false' });
		} else {
			submissionValues.push({ field: field.id, value: String(value) });
		}
	}

	if (submissionValues.length === 0) {
		return NextResponse.json({ error: 'No form data submitted.' }, { status: 400 });
	}

	try {
		await directus.request(
			withToken(
				FORM_TOKEN,
				createItem('form_submissions', {
					form: formId,
					values: submissionValues,
				} as Omit<FormSubmission, 'id'>),
			),
		);
	} catch (error) {
		console.error('Error creating form submission:', error);

		return NextResponse.json({ error: 'Failed to submit the form.' }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
