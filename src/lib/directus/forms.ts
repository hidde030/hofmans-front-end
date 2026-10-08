import { useDirectus } from './directus';
import type { FormField, FormSubmission, FormSubmissionValue } from '@/types/directus-schema';

// Server-only: uses DIRECTUS_FORM_TOKEN. Called from /api/forms/submit, never from client components.

/**
 * Fetches the fields of an active form so submissions can be validated against the CMS definition
 * instead of trusting whatever the browser sends.
 */
export const fetchFormDefinition = async (formId: string) => {
	const { directus, readItems } = useDirectus();

	try {
		const forms = await directus.request(
			readItems('forms', {
				filter: { id: { _eq: formId }, is_active: { _eq: true } },
				limit: 1,
				fields: ['id', { fields: ['id', 'name', 'type', 'label', 'validation', 'required'] }],
			}),
		);

		if (!forms.length) return null;

		const fields = ((forms[0].fields ?? []) as (FormField | string)[]).filter(
			(field): field is FormField => typeof field === 'object' && field !== null && !!field.name,
		);

		return { id: forms[0].id, fields };
	} catch (error) {
		console.error(`Error fetching form definition ${formId}:`, error);

		return null;
	}
};

export const submitForm = async (
	formId: string,
	fields: { id: string; name: string; type: string }[],
	data: Record<string, any>,
) => {
	const { directus, uploadFiles, createItem, withToken } = useDirectus();
	const TOKEN = process.env.DIRECTUS_FORM_TOKEN;

	if (!TOKEN) {
		throw new Error('DIRECTUS_FORM_TOKEN is not defined. Check your .env file.');
	}

	try {
		const submissionValues: Omit<FormSubmissionValue, 'id'>[] = [];

		for (const field of fields) {
			const value = data[field.name];

			if (value === undefined || value === null) continue;

			if (field.type === 'file' && value instanceof File) {
				const formData = new FormData();
				formData.append('file', value);

				const uploadedFile = await directus.request(withToken(TOKEN, uploadFiles(formData)));

				if (uploadedFile && 'id' in uploadedFile) {
					submissionValues.push({
						field: field.id,
						file: uploadedFile.id,
					});
				}
			} else {
				submissionValues.push({
					field: field.id,
					value: value.toString(),
				});
			}
		}

		const payload = {
			form: formId,
			values: submissionValues,
		};

		await directus.request(withToken(TOKEN, createItem('form_submissions', payload as Omit<FormSubmission, 'id'>)));
	} catch (error) {
		console.error('Error submitting form:', error);
		throw new Error('Failed to submit form');
	}
};
