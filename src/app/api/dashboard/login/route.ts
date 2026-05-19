import { NextResponse } from 'next/server';

import { DASHBOARD_ACCESS_COOKIE, DASHBOARD_REFRESH_COOKIE, loginToDirectus } from '@/lib/dashboard/auth';

export async function POST(request: Request) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
	}

	try {
		const session = await loginToDirectus(email, password);
		const response = NextResponse.json({ ok: true });

		const cookieOptions = {
			httpOnly: true,
			sameSite: 'lax' as const,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		};

		response.cookies.set(DASHBOARD_ACCESS_COOKIE, session.accessToken, {
			...cookieOptions,
			maxAge: 60 * 60 * 12,
		});

		if (session.refreshToken) {
			response.cookies.set(DASHBOARD_REFRESH_COOKIE, session.refreshToken, {
				...cookieOptions,
				maxAge: 60 * 60 * 24 * 30,
			});
		}

		return response;
	} catch (error) {
		return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to sign in.' }, { status: 401 });
	}
}
