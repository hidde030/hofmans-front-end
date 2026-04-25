import { fetchServiceData } from '@/lib/directus/fetchers';
import { PageBlock } from '@/types/directus-schema';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/layout/PageBuilder';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	try {
		const service = await fetchServiceData(slug);

		if (!service) return;

		return {
			title: service.seo?.title ?? service.title ?? '',
			description: service.seo?.meta_description ?? '',
			openGraph: {
				title: service.seo?.title ?? service.title ?? '',
				description: service.seo?.meta_description ?? '',
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/diensten/${slug}`,
				type: 'website',
			},
		};
	} catch (error) {
		console.error('Error loading service metadata:', error);

		return;
	}
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	try {
		const service = await fetchServiceData(slug);

		if (!service || !service.blocks) {
			notFound();
		}

		/* ServiceBlock vs PageBlock: internally they have the same shape for PageBuilder */
		const blocks: PageBlock[] = service.blocks.filter(
			(block: any): block is PageBlock => typeof block === 'object' && block.collection,
		);

		return (
			<main>
				<PageBuilder sections={blocks} />
			</main>
		);
	} catch (error) {
		console.error('Error loading service:', error);
		notFound();
	}
}
