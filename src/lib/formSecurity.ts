// Shared between the form UI and /api/forms/submit, so it must not contain secrets.

/** Hidden input that humans never see; bots that fill every field reveal themselves. */
export const HONEYPOT_FIELD = 'company_website';

export const MAX_UPLOAD_SIZE_MB = 25;
export const MAX_UPLOAD_SIZE = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

/** Common print-ready formats. SVG/HTML are deliberately excluded because Directus serves uploads from its own origin. */
export const ALLOWED_UPLOAD_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'ai', 'eps', 'psd', 'indd', 'zip'];

export const isAllowedUpload = (file: File) => {
	const extension = file.name.split('.').pop()?.toLowerCase();

	return !!extension && ALLOWED_UPLOAD_EXTENSIONS.includes(extension);
};
