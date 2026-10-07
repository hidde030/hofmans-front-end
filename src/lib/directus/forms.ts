/**
 * Client-side form submission. Instead of talking to Directus directly (which
 * would require exposing a token in the browser), it POSTs to our own
 * server-side API route that performs validation and writes to Directus.
 */
export const submitForm = async (formId: string, data: Record<string, any>, token: string, honeypot: string) => {
	const formData = new FormData();
	formData.append('formId', formId);
	formData.append('_token', token);
	formData.append('website', honeypot);

	for (const [name, value] of Object.entries(data)) {
		if (value === undefined || value === null) continue;

		if (value instanceof File) {
			formData.append(name, value);
		} else if (Array.isArray(value)) {
			for (const item of value) {
				formData.append(name, String(item));
			}
		} else {
			formData.append(name, String(value));
		}
	}

	const response = await fetch('/api/form-submit', {
		method: 'POST',
		body: formData,
	});

	const result = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error((result as { error?: string }).error || 'Failed to submit form');
	}

	return result;
};
