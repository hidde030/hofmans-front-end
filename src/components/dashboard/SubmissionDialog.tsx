'use client';

import { Download, FileText, Link2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { DashboardSubmission } from '@/lib/dashboard/submissions';

interface SubmissionDialogProps {
	submission: DashboardSubmission | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

function formatTimestamp(timestamp: string) {
	if (!timestamp) return 'Unknown time';

	return new Date(timestamp).toLocaleString('en-NL', {
		dateStyle: 'medium',
		timeStyle: 'short',
	});
}

export default function SubmissionDialog({ submission, isOpen, onOpenChange }: SubmissionDialogProps) {
	if (!submission) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border-slate-200 p-0 sm:max-w-4xl">
				<div className="grid max-h-[90vh] grid-rows-[auto,1fr] overflow-hidden bg-white">
					<DialogHeader className="border-b border-slate-200 px-6 py-5 text-left sm:px-8">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
								{submission.formTitle}
							</Badge>
							<Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
								{formatTimestamp(submission.timestamp)}
							</Badge>
						</div>
						<DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
							Submission details
						</DialogTitle>
						<p className="text-sm text-slate-500">
							{submission.fields.length} submitted field{submission.fields.length === 1 ? '' : 's'}
						</p>
					</DialogHeader>

					<div className="overflow-y-auto p-6 sm:px-8">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Submission ID</p>
								<p className="mt-2 break-all font-mono text-sm text-slate-800">{submission.id}</p>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Form</p>
								<p className="mt-2 text-sm font-medium text-slate-800">{submission.formTitle}</p>
							</div>
						</div>

						<Separator className="my-6 bg-slate-200" />

						<div className="space-y-4">
							{submission.fields.map((field) => (
								<div
									key={field.id}
									className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
								>
									<div className="flex flex-wrap items-start justify-between gap-4">
										<div>
											<p className="text-sm font-semibold text-slate-950">{field.fieldLabel}</p>
											<p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{field.fieldType}</p>
										</div>
										{field.file && (
											<Button
												asChild
												variant="outline"
												size="sm"
												className="border-slate-200 text-slate-700 hover:bg-slate-950 hover:text-white"
											>
												<a href={field.file.url} target="_blank" rel="noreferrer">
													<Download className="size-4" />
													Download file
												</a>
											</Button>
										)}
									</div>

									<div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
										{field.file ? (
											<div className="space-y-3">
												<p className="font-medium text-slate-900">{field.file.title}</p>
												<p className="text-slate-500">
													{field.file.type || 'file'}
													{field.file.filesize ? ` · ${Math.round(field.file.filesize / 1024)} KB` : ''}
												</p>
												<a
													href={field.file.url}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-2 text-sm font-medium text-slate-950 underline-offset-4 hover:underline"
												>
													<Link2 className="size-4" />
													Open file
												</a>
											</div>
										) : (
											<p className="whitespace-pre-wrap">{field.value || 'No value'}</p>
										)}
									</div>
								</div>
							))}

							{!submission.fields.length && (
								<div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
									<FileText className="mx-auto mb-3 size-5 text-slate-400" />
									This submission does not include any values.
								</div>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
