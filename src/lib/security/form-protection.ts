import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Server-only helpers to protect form submissions against bots.
 *
 * The challenge token is a signed timestamp. The server hands it out when a
 * form is rendered, and verifies it when the form is submitted. Because the
 * timestamp is HMAC-signed with a server secret, a bot cannot forge an "old"
 * timestamp to bypass the minimum-fill-time check.
 */

const getSecret = (): string =>
	process.env.FORM_SECRET || process.env.DIRECTUS_FORM_TOKEN || process.env.DRAFT_MODE_SECRET || '';

const sign = (payload: string, secret: string): string =>
	createHmac('sha256', secret).update(payload).digest('hex');

const MIN_SUBMIT_MS = Number(process.env.FORM_MIN_SUBMIT_MS) || 3_000;
const MAX_SUBMIT_MS = Number(process.env.FORM_MAX_SUBMIT_MS) || 60 * 60 * 1_000; // 1 hour

export interface FormChallenge {
	token: string;
}

/** Creates a new signed challenge token. Returns null when no secret is configured. */
export function issueFormChallenge(): FormChallenge | null {
	const secret = getSecret();
	if (!secret) return null;

	const timestamp = Date.now().toString();

	return { token: `${timestamp}.${sign(timestamp, secret)}` };
}

/**
 * Verifies a challenge token. Returns true only when the signature is valid
 * and the token's age falls between MIN_SUBMIT_MS (humans don't fill forms
 * instantly) and MAX_SUBMIT_MS (prevents replaying stale tokens).
 */
export function verifyFormChallenge(token: string | null | undefined): boolean {
	const secret = getSecret();
	if (!secret || !token) return false;

	const separatorIndex = token.lastIndexOf('.');
	if (separatorIndex <= 0) return false;

	const timestamp = token.slice(0, separatorIndex);
	const signature = token.slice(separatorIndex + 1);

	const expected = sign(timestamp, secret);
	const signatureBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);

	if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
		return false;
	}

	const createdAt = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(createdAt)) return false;

	const age = Date.now() - createdAt;

	return age >= MIN_SUBMIT_MS && age <= MAX_SUBMIT_MS;
}
