// In-memory sliding window. Good enough for a single Node instance; use a shared store (e.g. Redis) when scaling out.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number) {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);

	if (recent.length >= limit) {
		hits.set(key, recent);

		return true;
	}

	recent.push(now);
	hits.set(key, recent);

	if (hits.size > 1000) {
		for (const [entryKey, timestamps] of hits) {
			if (timestamps.every((timestamp) => now - timestamp >= windowMs)) hits.delete(entryKey);
		}
	}

	return false;
}
