import { aggregate, readItems, withToken } from '@directus/sdk';

import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { useDirectus } from '@/lib/directus/directus';
import type { DirectusFile, FormField } from '@/types/directus-schema';

type DirectusSubmissionValue = {
    id: string;
    value?: string | null;
    timestamp?: string | null;
    field?: FormField | string | null;
    file?: DirectusFile | string | null;
};

type DirectusSubmission = {
    id: string;
    timestamp?: string | null;
    form?: {
        id: string;
        title?: string | null;
        fields?: FormField[] | string[];
    } | string | null;
    values?: DirectusSubmissionValue[] | string[];
};

export type DashboardSubmissionValue = {
    id: string;
    fieldId: string;
    fieldName: string;
    fieldLabel: string;
    fieldType: string;
    value: string;
    file?: {
        id: string;
        title: string;
        type: string;
        url: string;
        filenameDownload?: string | null;
        filesize?: number | null;
    };
};

export type DashboardSubmission = {
    id: string;
    timestamp: string;
    formId: string;
    formTitle: string;
    fields: DashboardSubmissionValue[];
    summary: string;
    downloadUrl: string;
};

export type DashboardSubmissionPage = {
    submissions: DashboardSubmission[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

const DEFAULT_PAGE_SIZE = 12;

function formatLabel(field: FormField | string | null | undefined) {
    if (!field || typeof field === 'string') {
        return { id: typeof field === 'string' ? field : '', name: '', label: 'Untitled field', type: 'text' };
    }

    return {
        id: field.id,
        name: field.name || field.label || field.id,
        label: field.label || field.name || 'Untitled field',
        type: field.type || 'text',
    };
}

function normalizeValue(value: DirectusSubmissionValue): DashboardSubmissionValue | null {
    const label = formatLabel(value.field);
    const rawValue = typeof value.value === 'string' ? value.value : value.value ? String(value.value) : '';
    const file = value.file && typeof value.file !== 'string' ? value.file : null;

    if (!rawValue && !file) {
        return null;
    }

    return {
        id: value.id,
        fieldId: label.id || label.name,
        fieldName: label.name,
        fieldLabel: label.label,
        fieldType: label.type,
        value: file ? file.title || file.filename_download || file.id : rawValue,
        file: file
            ? {
                id: file.id,
                title: file.title || file.filename_download || file.id,
                type: file.type || '',
                url: getDirectusAssetURL(file),
                filenameDownload: file.filename_download,
                filesize: file.filesize ?? null,
            }
            : undefined,
    };
}

function buildSummary(fields: DashboardSubmissionValue[]) {
    if (!fields.length) {
        return 'No submitted values';
    }

    return fields
        .slice(0, 3)
        .map((field) => `${field.fieldLabel}: ${field.value}`)
        .join(' · ');
}

function mapSubmission(submission: DirectusSubmission): DashboardSubmission {
    const form = submission.form && typeof submission.form !== 'string' ? submission.form : null;
    const values = Array.isArray(submission.values)
        ? submission.values
            .map((value) => (value && typeof value !== 'string' ? normalizeValue(value) : null))
            .filter((value): value is DashboardSubmissionValue => Boolean(value))
        : [];

    return {
        id: submission.id,
        timestamp: submission.timestamp || '',
        formId: form?.id || '',
        formTitle: form?.title || 'Untitled form',
        fields: values,
        summary: buildSummary(values),
        downloadUrl: `/api/dashboard/submissions/${submission.id}`,
    };
}

export async function fetchDashboardSubmissions(accessToken: string, page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<DashboardSubmissionPage> {
    const { directus } = useDirectus();
    const [submissions, totalResult] = await Promise.all([
        directus.request(
            withToken(
                accessToken,
                readItems('form_submissions', {
                    page,
                    limit: pageSize,
                    sort: ['-timestamp'],
                    fields: [
                        'id',
                        'timestamp',
                        { form: ['id', 'title'] },
                        {
                            values: [
                                'id',
                                'value',
                                'timestamp',
                                { field: ['id', 'name', 'label', 'type'] },
                                { file: ['id', 'title', 'type', 'filename_download', 'filesize', 'width', 'height'] },
                            ],
                        },
                    ],
                }),
            ),
        ),
        directus.request(
            withToken(
                accessToken,
                aggregate('form_submissions', {
                    aggregate: { count: '*' },
                }),
            ),
        ),
    ]);

    const total = Number(totalResult?.[0]?.count || 0);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
        submissions: (submissions as DirectusSubmission[]).map(mapSubmission),
        total,
        page,
        pageSize,
        totalPages,
    };
}

export async function fetchDashboardSubmission(accessToken: string, submissionId: string): Promise<DashboardSubmission | null> {
    const { directus } = useDirectus();
    const response = await directus.request(
        withToken(
            accessToken,
            readItems('form_submissions', {
                filter: { id: { _eq: submissionId } },
                limit: 1,
                fields: [
                    'id',
                    'timestamp',
                    { form: ['id', 'title'] },
                    {
                        values: [
                            'id',
                            'value',
                            'timestamp',
                            { field: ['id', 'name', 'label', 'type'] },
                            { file: ['id', 'title', 'type', 'filename_download', 'filesize', 'width', 'height'] },
                        ],
                    },
                ],
            }),
        ),
    );

    return (response as DirectusSubmission[])[0] ? mapSubmission((response as DirectusSubmission[])[0]) : null;
}

export async function fetchAllDashboardSubmissions(accessToken: string): Promise<DashboardSubmission[]> {
    const pageSize = 100;
    let page = 1;
    const submissions: DashboardSubmission[] = [];

    while (true) {
        const pageResult = await fetchDashboardSubmissions(accessToken, page, pageSize);
        submissions.push(...pageResult.submissions);

        if (page >= pageResult.totalPages || pageResult.submissions.length < pageSize) {
            break;
        }

        page += 1;
    }

    return submissions;
}

function escapeCsv(value: string) {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
}

export function buildSubmissionsCsv(submissions: DashboardSubmission[]) {
    const rows: string[] = ['submission_id,form_title,timestamp,field_label,field_value,file_url,file_name,file_type'];

    for (const submission of submissions) {
        if (!submission.fields.length) {
            rows.push(
                [
                    escapeCsv(submission.id),
                    escapeCsv(submission.formTitle),
                    escapeCsv(submission.timestamp),
                    '',
                    '',
                    '',
                    '',
                    '',
                ].join(','),
            );
            continue;
        }

        for (const field of submission.fields) {
            rows.push(
                [
                    escapeCsv(submission.id),
                    escapeCsv(submission.formTitle),
                    escapeCsv(submission.timestamp),
                    escapeCsv(field.fieldLabel),
                    escapeCsv(field.value),
                    escapeCsv(field.file?.url || ''),
                    escapeCsv(field.file?.filenameDownload || field.file?.title || ''),
                    escapeCsv(field.file?.type || ''),
                ].join(','),
            );
        }
    }

    return rows.join('\n');
}

export function buildSubmissionCsv(submission: DashboardSubmission) {
    return buildSubmissionsCsv([submission]);
}
