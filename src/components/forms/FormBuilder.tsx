'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import DynamicForm from './DynamicForm';
import { submitForm } from '@/lib/directus/forms';
import { FormField } from '@/types/directus-schema';
import { cn } from '@/lib/utils';

interface FormBuilderProps {
	className?: string;
	itemId?: string;
	form: {
		id: string;
		on_success?: 'redirect' | 'message' | null;
		sort?: number | null;
		submit_label?: string;
		success_message?: string | null;
		title?: string | null;
		success_redirect_url?: string | null;
		is_active?: boolean | null;
		fields: FormField[];
	};
}

const FormBuilder = ({ form, className }: FormBuilderProps) => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [challenge, setChallenge] = useState<string | null>(null);
	const [challengeFailed, setChallengeFailed] = useState(false);

	// Fetch a signed challenge token as soon as the form is rendered. The token
	// encodes the render time so the server can reject instant bot submissions.
	useEffect(() => {
		let cancelled = false;

		const loadChallenge = async () => {
			try {
				const response = await fetch('/api/form-submit');
				const json = await response.json();

				if (cancelled) return;

				if (json?.token) {
					setChallenge(json.token);
				} else {
					setChallengeFailed(true);
				}
			} catch {
				if (!cancelled) setChallengeFailed(true);
			}
		};

		loadChallenge();

		return () => {
			cancelled = true;
		};
	}, []);

	if (!form.is_active) return null;

	const handleSubmit = async (data: Record<string, any>) => {
		setError(null);

		if (!challenge) {
			setError(
				challengeFailed
					? 'The form could not be initialized. Please refresh the page and try again.'
					: 'The form is still loading. Please try again in a moment.',
			);

			return;
		}

		try {
			// Read the hidden honeypot field (empty for real users, filled by bots).
			const honeypot = (
				document.getElementById(`website-${form.id}`) as HTMLInputElement | null
			)?.value;

			await submitForm(form.id, data, challenge, honeypot || '');

			if (form.on_success === 'redirect' && form.success_redirect_url) {
				window.location.href = form.success_redirect_url;
			} else {
				setIsSubmitted(true);
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			setError(err instanceof Error && err.message ? err.message : 'Failed to submit the form. Please try again later.');
		}
	};

	if (isSubmitted) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
				<CheckCircle className="size-12 text-green-500" />
				<p className="text-gray-600">{form.success_message || 'Your form has been submitted successfully.'}</p>
			</div>
		);
	}

	return (
		<div className={cn('space-y-6 rounded-lg border border-input p-8', className)}>
			{form.title && <h3 className="mb-4 text-xl font-semibold">{form.title}</h3>}

			{error && (
				<div className="rounded-md bg-red-100 p-4 text-red-500">
					<strong>Error:</strong> {error}
				</div>
			)}

			<DynamicForm
				fields={form.fields}
				onSubmit={handleSubmit}
				submitLabel={form.submit_label || 'Submit'}
				id={form.id}
			/>
		</div>
	);
};

export default FormBuilder;
