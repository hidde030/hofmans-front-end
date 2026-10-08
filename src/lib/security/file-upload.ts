/**
 * Upload policy for form file fields. Shared by the client (early feedback)
 * and the server route (enforcement), so it must not read server-only env.
 *
 * Only document and raster image types are allowed. HTML, SVG and other
 * types that browsers can execute are deliberately excluded, since uploaded
 * files are served from the Directus asset URL.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES: Record<string, string[]> = {
	pdf: ['application/pdf'],
	jpg: ['image/jpeg'],
	jpeg: ['image/jpeg'],
	png: ['image/png'],
	webp: ['image/webp'],
	doc: ['application/msword'],
	docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

/** Value for the file input's `accept` attribute. */
export const UPLOAD_ACCEPT = Object.keys(ALLOWED_TYPES)
	.map((ext) => `.${ext}`)
	.join(',');

const getExtension = (filename: string): string => {
	const dotIndex = filename.lastIndexOf('.');

	return dotIndex === -1 ? '' : filename.slice(dotIndex + 1).toLowerCase();
};

/** Both the extension and the declared MIME type must be on the allowlist and match each other. */
export const isAllowedFileType = (file: File): boolean => {
	const allowedMimeTypes = ALLOWED_TYPES[getExtension(file.name)];

	return !!allowedMimeTypes && allowedMimeTypes.includes(file.type.toLowerCase());
};

export const isAllowedFileSize = (file: File): boolean => file.size > 0 && file.size <= MAX_UPLOAD_BYTES;
