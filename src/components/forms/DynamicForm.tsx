'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/blocks/Button';
import { Form } from '@/components/ui/form';
import Field from './FormField';
import { buildZodSchema } from '@/lib/zodSchemaBuilder';
import { HONEYPOT_FIELD } from '@/lib/formSecurity';
import type { FormField as FormFieldType } from '@/types/directus-schema';
import { setAttr } from '@directus/visual-editing';

interface DynamicFormProps {
	fields: FormFieldType[];
	onSubmit: (data: Record<string, any>, honeypot: string) => void;
	submitLabel: string;
	id: string;
}

const DynamicForm = ({ fields, onSubmit, submitLabel, id }: DynamicFormProps) => {
	const sortedFields = [...fields].sort((a, b) => (a.sort || 0) - (b.sort || 0));
	const formSchema = buildZodSchema(fields);
	const honeypotRef = useRef<HTMLInputElement>(null);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: fields.reduce<Record<string, any>>((defaults, field) => {
			if (!field.name) return defaults;
			switch (field.type) {
				case 'checkbox':
					defaults[field.name] = false;
					break;
				case 'checkbox_group':
					defaults[field.name] = [];
					break;
				case 'radio':
					defaults[field.name] = '';
					break;
				default:
					defaults[field.name] = '';
					break;
			}

			return defaults;
		}, {}),
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => onSubmit(data, honeypotRef.current?.value ?? ''))}
				className="flex flex-wrap gap-4"
				data-directus={setAttr({
					collection: 'forms',
					item: id,
					fields: 'fields',
					mode: 'popover',
				})}
			>
				{/* Spam trap: kept off-screen instead of display:none, which many bots skip. */}
				<div aria-hidden="true" className="absolute left-[-10000px] size-px overflow-hidden">
					<input ref={honeypotRef} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
				</div>
				{sortedFields.map((field) => (
					<Field key={field.id} field={field} form={form} />
				))}
				<div className="w-full">
					<div
						data-directus={setAttr({
							collection: 'forms',
							item: id,
							fields: 'submit_label',
							mode: 'popover',
						})}
					>
						<Button type="submit" label={submitLabel} icon="arrow" iconPosition="right" id={`submit-${id}`} />
					</div>
				</div>
			</form>
		</Form>
	);
};

export default DynamicForm;
