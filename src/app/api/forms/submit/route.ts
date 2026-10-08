import { NextResponse } from 'next/server';

import { fetchFormDefinition, submitForm } from '@/lib/directus/forms';
import { HONEYPOT_FIELD } from '@/lib/formSecurity';
import { isRateLimited } from '@/lib/rateLimit';
import { buildZodSchema } from '@/lib/zodSchemaBuilder';
import type { FormField } from '@/types/directus-schema';

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** Rebuilds the values react-hook-form had on the client, so the same zod schema can validate them. */
function readFieldValues(body: FormData, fields: FormField[]) {
	const data: Record<string, unknown> = {};

	for (const field of fields) {
		const name = field.name!;

		switch (field.type) {
			case 'checkbox':
				data[name] = body.get(name) === 'true';
				break;
			case 'checkbox_group':
				data[name] = body.getAll(name).filter((value): value is string => typeof value === 'string');
				break;
			case 'file': {
				const file = body.get(name);
				data[name] = file instanceof File && file.size > 0 ? file : undefined;
				break;
			}
			default: {
				const value = body.get(name);
				data[name] = typeof value === 'string' ? value : '';
				break;
			}
		}
	}

	return data;
}

export async function POST(request: Request) {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

	if (isRateLimited(`form:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
		return NextResponse.json(
			{ error: 'Je hebt te veel formulieren verstuurd. Probeer het over een paar minuten opnieuw.' },
			{ status: 429 },
		);
	}

	let body: FormData;

	try {
		body = await request.formData();
	} catch {
		return NextResponse.json({ error: 'Ongeldige aanvraag.' }, { status: 400 });
	}

	// Pretend success so bots don't learn they were filtered out.
	if (body.get(HONEYPOT_FIELD)) {
		return NextResponse.json({ ok: true });
	}

	const formId = body.get('formId');

	if (typeof formId !== 'string' || !formId) {
		return NextResponse.json({ error: 'Ongeldige aanvraag.' }, { status: 400 });
	}

	const form = await fetchFormDefinition(formId);

	if (!form) {
		return NextResponse.json({ error: 'Dit formulier is niet (meer) beschikbaar.' }, { status: 404 });
	}

	const result = buildZodSchema(form.fields).safeParse(readFieldValues(body, form.fields));

	if (!result.success) {
		return NextResponse.json(
			{ error: 'Controleer de ingevulde velden.', fields: result.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	try {
		await submitForm(
			form.id,
			form.fields.map((field) => ({ id: field.id, name: field.name!, type: field.type || '' })),
			result.data,
		);

		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: 'Het versturen is mislukt. Probeer het later opnieuw.' }, { status: 500 });
	}
}
