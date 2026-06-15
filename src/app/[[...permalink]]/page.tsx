import { fetchPageData, fetchSiteData } from '@/lib/directus/fetchers';
import { PageBlock } from '@/types/directus-schema';
import { notFound } from 'next/navigation';
import PageClient from './PageClient';
import { webpageSchema, breadcrumbSchema, serializeJsonLd } from '@/lib/seo/json-ld';

export async function generateMetadata({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = `/${permalinkSegments.join('/')}`.replace(/\/$/, '') || '/';

	try {
		const page = await fetchPageData(resolvedPermalink);

		if (!page) return;

		return {
			title: page.seo?.title ?? page.title ?? '',
			description: page.seo?.meta_description ?? '',
			openGraph: {
				title: page.seo?.title ?? page.title ?? '',
				description: page.seo?.meta_description ?? '',
				url: `${process.env.NEXT_PUBLIC_SITE_URL}${resolvedPermalink}`,
				type: 'website',
			},
		};
	} catch (error) {
		console.error('Error loading page metadata:', error);

		return;
	}
}

export default async function Page({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = `/${permalinkSegments.join('/')}`.replace(/\/$/, '') || '/';

	try {
		const [page, { globals, headerNavigation }] = await Promise.all([
			fetchPageData(resolvedPermalink),
			fetchSiteData(),
		]);

		if (!page || !page.blocks) {
			notFound();
		}

		const blocks: PageBlock[] = page.blocks.filter(
			(block: any): block is PageBlock => typeof block === 'object' && block.collection,
		);

		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
		const pageUrl = `${siteUrl}${resolvedPermalink}`;

		const webpageJsonLd = webpageSchema(page, pageUrl);
		const webpageJsonLdString = serializeJsonLd(webpageJsonLd);

		const permalinkParts = resolvedPermalink.split('/').filter(Boolean);
		const breadcrumbItems = [
			{ name: 'Home', url: `${siteUrl}/` },
			...permalinkParts.map((part, i) => ({
				name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
				url: `${siteUrl}/${permalinkParts.slice(0, i + 1).join('/')}`,
			})),
		];
		const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);
		const breadcrumbJsonLdString = serializeJsonLd(breadcrumbJsonLd);

		return (
			<>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webpageJsonLdString }} />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} />
				<PageClient
					sections={blocks}
					pageId={page.id}
					customNavigation={(page as any).custom_navigation}
					headerNavigation={headerNavigation}
					globals={globals}
					headerBackgroundColor={page.header_background_color}
					headerLogo={page.header_logo}
					hideHomeLink={page.hide_home_link ?? false}
				/>
			</>
		);
	} catch (error) {
		console.error('Error loading page:', error);
		notFound();
	}
}
