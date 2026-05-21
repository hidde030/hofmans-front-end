import { NextResponse } from 'next/server';

import { DASHBOARD_ACCESS_COOKIE, DASHBOARD_REFRESH_COOKIE } from '@/lib/dashboard/auth';

export async function GET(request: Request) {
	const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
	redirectResponse.cookies.set(DASHBOARD_ACCESS_COOKIE, '', { path: '/', maxAge: 0 });
	redirectResponse.cookies.set(DASHBOARD_REFRESH_COOKIE, '', { path: '/', maxAge: 0 });

	return redirectResponse;
}

export async function POST() {
	const jsonResponse = NextResponse.json({ ok: true });
	jsonResponse.cookies.set(DASHBOARD_ACCESS_COOKIE, '', { path: '/', maxAge: 0 });
	jsonResponse.cookies.set(DASHBOARD_REFRESH_COOKIE, '', { path: '/', maxAge: 0 });

	return jsonResponse;
}
