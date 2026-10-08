/**
 * Minimal in-memory rate limiter for form submissions.
 *
 * Note: in-memory state is per server instance. For a single-instance
 * deployment (typical for this project) that is sufficient to stop simple
 * bot floods. For multi-instance deployments, replace with a shared store
 * (e.g. Redis or Railway's built-in metrics).
 */

interface WindowEntry {
	hits: number[];
}

const windows = new Map<string, WindowEntry>();

const DEFAULT_LIMIT = Number(process.env.FORM_RATE_LIMIT) || 5;
const DEFAULT_WINDOW_MS = Number(process.env.FORM_RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1_000; // 10 minutes
const MAX_TRACKED_KEYS = 10_000;

function prune() {
	if (windows.size <= MAX_TRACKED_KEYS) return;

	const now = Date.now();
	for (const [key, entry] of windows) {
		entry.hits = entry.hits.filter((t) => now - t < DEFAULT_WINDOW_MS);
		if (entry.hits.length === 0) windows.delete(key);
	}
}

export interface RateLimitResult {
	allowed: boolean;
	retryAfterMs?: number;
}

export function rateLimit(key: string, limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS): RateLimitResult {
	prune();

	const now = Date.now();
	const windowStart = now - windowMs;

	const entry = windows.get(key) ?? { hits: [] };
	entry.hits = entry.hits.filter((t) => t > windowStart);

	if (entry.hits.length >= limit) {
		const oldest = entry.hits[0];
		const retryAfterMs = Math.max(0, oldest + windowMs - now);
		windows.set(key, entry);

		return { allowed: false, retryAfterMs };
	}

	entry.hits.push(now);
	windows.set(key, entry);

	return { allowed: true };
}
