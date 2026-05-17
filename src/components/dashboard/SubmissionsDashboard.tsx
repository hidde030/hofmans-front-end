'use client';
/* eslint-disable newline-before-return */

import { useMemo, useState } from 'react';
import { Download, FileText, LayoutGrid, LogOut, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import SubmissionDialog from '@/components/dashboard/SubmissionDialog';
import type { DashboardSubmission, DashboardSubmissionPage } from '@/lib/dashboard/submissions';

interface SubmissionsDashboardProps extends DashboardSubmissionPage {
	pagePath?: string;
}
function formatTimestamp(timestamp: string) {
	if (!timestamp) return 'Unknown time';

	return new Date(timestamp).toLocaleString('en-NL', {
		dateStyle: 'medium',
		timeStyle: 'short',
	});
}

function SubmissionRow({
	submission,
	onOpen,
}: {
	submission: DashboardSubmission;
	onOpen: (submission: DashboardSubmission) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => onOpen(submission)}
			className="group grid w-full gap-4 border-b border-slate-200 px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:grid-cols-[1.2fr_0.8fr_1.2fr_auto]"
		>
			<div>
				<p className="text-sm font-semibold text-slate-950 group-hover:text-slate-700">{submission.formTitle}</p>
				<p className="mt-1 text-xs text-slate-500">{submission.id}</p>
			</div>
			<div>
				<p className="text-sm text-slate-700">{formatTimestamp(submission.timestamp)}</p>
			</div>
			<div>
				<p className="line-clamp-2 text-sm leading-6 text-slate-600">{submission.summary}</p>
			</div>
			<div className="flex justify-start sm:justify-end">
				<span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:border-slate-300 group-hover:text-slate-900">
					<FileText className="size-3.5" />
					Open
				</span>
			</div>
		</button>
	);
}

export default function SubmissionsDashboard({
	submissions,
	total,
	page,
	pageSize,
	totalPages,
}: SubmissionsDashboardProps) {
	const [selectedSubmission, setSelectedSubmission] = useState<DashboardSubmission | null>(submissions[0] || null);
	const [query, setQuery] = useState('');

	const filteredSubmissions = useMemo(() => {
		if (!query.trim()) {
			return submissions;
		}

		const search = query.toLowerCase();
		return submissions.filter((submission) => {
			return (
				submission.formTitle.toLowerCase().includes(search) ||
				submission.summary.toLowerCase().includes(search) ||
				submission.fields.some(
					(field) => field.fieldLabel.toLowerCase().includes(search) || field.value.toLowerCase().includes(search),
				)
			);
		});
	}, [query, submissions]);

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
			<div className="mx-auto flex min-h-screen max-w-[1600px]">
				<aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-slate-950 px-6 py-8 text-white lg:flex lg:flex-col">
					<div>
						<p className="text-xs uppercase  text-white/45">Dashboard</p>
						<h1 className="mt-3 text-2xl font-semibold tracking-tight">Hofmans</h1>
					</div>

					<nav className="mt-10 space-y-2">
						<div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
							<LayoutGrid className="size-4" />
							Form submissions
						</div>
					</nav>

					<div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
						<p className="font-medium text-white">{total} submissions</p>
					</div>
				</aside>

				<main className="flex-1 px-4 py-6 sm:px-6 lg:p-8">
					<div className="rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
						<div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
							<div>
								<p className="text-xs uppercase text-slate-500">Formulierinzendingen</p>
								<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
									Inzendingen bekijken, controleren en exporteren
								</h2>
								<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
									Open elke inzending om alle ingevulde waarden, bestandsbijlagen en metadata op één plek te zien.
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<Button
									asChild
									variant="outline"
									className="border-slate-200 text-slate-700 hover:bg-slate-950 hover:text-white"
								></Button>
								<Button asChild variant="ghost" className="text-slate-600 hover:bg-slate-100 hover:text-slate-950">
									<a href="/api/dashboard/logout">
										<LogOut className="size-4" />
										Sign out
									</a>
								</Button>
							</div>
						</div>

						<div className="border-b border-slate-200 px-5 py-4 sm:px-6">
							<div className="relative max-w-xl">
								<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
								<Input
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Zoek inzendingen, waarden of formuliertitels"
									className="h-12 border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400"
								/>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
							<div className="flex items-center gap-2 text-sm text-slate-600">
								<Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
									Page {page}
								</Badge>
								<Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
									{total} total
								</Badge>
								<Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
									{filteredSubmissions.length} visible
								</Badge>
							</div>

							<div className="flex items-center gap-2 text-sm text-slate-500">
								{page > 1 ? (
									<a
										className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
										href={`/dashboard?page=${page - 1}`}
									>
										Previous
									</a>
								) : (
									<span className="rounded-full border border-slate-100 px-3 py-1.5 text-slate-300">Previous</span>
								)}
								<span>
									Page {page} of {totalPages}
								</span>
								{page < totalPages ? (
									<a
										className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
										href={`/dashboard?page=${page + 1}`}
									>
										Next
									</a>
								) : (
									<span className="rounded-full border border-slate-100 px-3 py-1.5 text-slate-300">Next</span>
								)}
							</div>
						</div>

						<Separator className="bg-slate-200" />

						<div className="overflow-hidden rounded-b-[2rem]">
							<div className="hidden grid-cols-[1.2fr_0.8fr_1.2fr_auto] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:grid sm:px-6">
								<div>Form</div>
								<div>Timestamp</div>
								<div>Summary</div>
								<div className="text-right">Open</div>
							</div>

							<div>
								{filteredSubmissions.map((submission) => (
									<SubmissionRow key={submission.id} submission={submission} onOpen={setSelectedSubmission} />
								))}

								{!filteredSubmissions.length && (
									<div className="px-6 py-16 text-center text-sm text-slate-500">No submissions match your search.</div>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>

			<SubmissionDialog
				submission={selectedSubmission}
				isOpen={Boolean(selectedSubmission)}
				onOpenChange={(open) => !open && setSelectedSubmission(null)}
			/>
		</div>
	);
}
