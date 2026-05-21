import { NextResponse } from 'next/server';

import { getDashboardSession } from '@/lib/dashboard/auth';
import { buildSubmissionCsv, fetchDashboardSubmission } from '@/lib/dashboard/submissions';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const session = getDashboardSession(request.headers.get('cookie'));
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const format = searchParams.get('format') || 'json';

	if (!session?.accessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const submission = await fetchDashboardSubmission(session.accessToken, id);

	if (!submission) {
		return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
	}

	if (format === 'csv') {
		const csv = buildSubmissionCsv(submission);

		return new NextResponse(csv, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="form-submission-${submission.id}.csv"`,
			},
		});
	}

	return NextResponse.json(submission);
}
