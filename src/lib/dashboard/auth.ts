/* eslint-disable newline-before-return */
export const DASHBOARD_ACCESS_COOKIE = 'dashboard_access_token';
export const DASHBOARD_REFRESH_COOKIE = 'dashboard_refresh_token';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export type DashboardSession = {
	accessToken: string;
	refreshToken?: string;
	expiresAt?: string;
};

export function getDashboardSession(cookieHeader?: string | null) {
	if (!cookieHeader) {
		return null;
	}

	const cookieMap = Object.fromEntries(
		cookieHeader
			.split(';')
			.map((entry) => entry.trim())
			.filter(Boolean)
			.map((entry) => {
				const separatorIndex = entry.indexOf('=');
				const key = separatorIndex >= 0 ? entry.slice(0, separatorIndex) : entry;
				const value = separatorIndex >= 0 ? entry.slice(separatorIndex + 1) : '';
				return [decodeURIComponent(key), decodeURIComponent(value)];
			}),
	) as Record<string, string>;

	const accessToken = cookieMap[DASHBOARD_ACCESS_COOKIE];
	const refreshToken = cookieMap[DASHBOARD_REFRESH_COOKIE];

	if (!accessToken) {
		return null;
	}

	return {
		accessToken,
		refreshToken,
	} satisfies DashboardSession;
}

export function getDirectusBaseUrl() {
	if (!DIRECTUS_URL) {
		throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined.');
	}

	return DIRECTUS_URL.replace(/\/$/, '');
}

export async function loginToDirectus(email: string, password: string): Promise<DashboardSession> {
	const response = await fetch(`${getDirectusBaseUrl()}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		const message =
			payload?.errors?.[0]?.message || payload?.message || 'Unable to sign in with your Directus account.';
		throw new Error(message);
	}

	const data = payload?.data ?? payload;

	if (!data?.access_token) {
		throw new Error('Directus did not return an access token.');
	}

	return {
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresAt: data.expires,
	};
}
