import { headers } from 'next/headers';

import LoginPanel from '@/components/dashboard/LoginPanel';
import SubmissionsDashboard from '@/components/dashboard/SubmissionsDashboard';
import { getDashboardSession } from '@/lib/dashboard/auth';
import { fetchDashboardSubmissions } from '@/lib/dashboard/submissions';

const PAGE_SIZE = 12;

export default async function DashboardPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
	const params = (await searchParams) || {};
	const page = Math.max(1, Number(params.page || 1) || 1);
	const headerStore = (await headers()) as any;
	const session = getDashboardSession(headerStore.get('cookie'));

	if (!session?.accessToken) {
		return <LoginPanel />;
	}

	try {
		const dashboardData = await fetchDashboardSubmissions(session.accessToken, page, PAGE_SIZE);

		return <SubmissionsDashboard {...dashboardData} />;
	} catch (error) {
		console.error('Failed to load dashboard submissions:', error);

		return <LoginPanel />;
	}
}
