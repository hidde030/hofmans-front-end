'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import DynamicForm from './DynamicForm';
import { HONEYPOT_FIELD } from '@/lib/formSecurity';
import { FormField } from '@/types/directus-schema';
import { cn } from '@/lib/utils';

const SUBMIT_ERROR = 'Het versturen is mislukt. Probeer het later opnieuw.';

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

	if (!form.is_active) return null;

	const handleSubmit = async (data: Record<string, any>, honeypot: string) => {
		setError(null);

		const body = new FormData();
		body.append('formId', form.id);
		body.append(HONEYPOT_FIELD, honeypot);

		for (const field of form.fields) {
			const value = field.name ? data[field.name] : undefined;

			if (!field.name || value === undefined || value === null) continue;

			if (Array.isArray(value)) {
				value.forEach((item) => body.append(field.name!, String(item)));
			} else if (value instanceof File) {
				body.append(field.name, value);
			} else {
				body.append(field.name, String(value));
			}
		}

		try {
			const response = await fetch('/api/forms/submit', { method: 'POST', body });

			if (!response.ok) {
				const payload = await response.json().catch(() => null);
				setError(payload?.error || SUBMIT_ERROR);

				return;
			}

			if (form.on_success === 'redirect' && form.success_redirect_url) {
				window.location.href = form.success_redirect_url;
			} else {
				setIsSubmitted(true);
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			setError(SUBMIT_ERROR);
		}
	};

	if (isSubmitted) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
				<CheckCircle className="size-12 text-green-500" />
				<p className="text-gray-600">{form.success_message || 'Bedankt! Je formulier is verstuurd.'}</p>
			</div>
		);
	}

	return (
		<div className={cn('space-y-6 rounded-lg border border-input p-8', className)}>
			{form.title && <h3 className="mb-4 text-xl font-semibold">{form.title}</h3>}

			{error && (
				<div className="rounded-md bg-red-100 p-4 text-red-500">
					<strong>Fout:</strong> {error}
				</div>
			)}

			<DynamicForm
				fields={form.fields}
				onSubmit={handleSubmit}
				submitLabel={form.submit_label || 'Versturen'}
				id={form.id}
			/>
		</div>
	);
};

export default FormBuilder;
