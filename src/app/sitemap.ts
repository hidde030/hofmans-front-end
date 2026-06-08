import { useDirectus } from '@/lib/directus/directus';
import type { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	if (!siteUrl) {
		console.warn('Environment variable NEXT_PUBLIC_SITE_URL is not set, sitemap might have invalid URLs');
	}

	const { directus, readItems } = useDirectus();

	try {
		const pagesPromise = directus.request(
			readItems('pages', {
				filter: { status: { _eq: 'published' } },
				fields: ['permalink', 'published_at', 'date_updated', 'seo'],
				limit: -1,
			}),
		);

		const servicesPromise = directus.request(
			readItems('services', {
				filter: { status: { _eq: 'published' } },
				fields: ['slug', 'date_updated', 'seo'],
				limit: -1,
			}),
		);

		const [pages, services] = await Promise.all([pagesPromise, servicesPromise]);

		const pageEntries: SitemapEntry[] = pages
			.filter((page: any) => page.permalink && !page.seo?.no_index)
			.map((page: any) => ({
				url: `${siteUrl}${page.permalink}`,
				lastModified: page.published_at || page.date_updated ? new Date(page.published_at || page.date_updated) : new Date(),
				changeFrequency: page.seo?.sitemap?.change_frequency,
				priority: page.seo?.sitemap?.priority ? parseFloat(page.seo.sitemap.priority) : undefined,
			}));

		const serviceEntries: SitemapEntry[] = services
			.filter((service: any) => service.slug && !service.seo?.no_index)
			.map((service: any) => ({
				url: `${siteUrl}/diensten/${service.slug}`,
				lastModified: service.date_updated ? new Date(service.date_updated) : new Date(),
				changeFrequency: service.seo?.sitemap?.change_frequency,
				priority: service.seo?.sitemap?.priority ? parseFloat(service.seo.sitemap.priority) : undefined,
			}));

		return [...pageEntries, ...serviceEntries];
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return [];
	}
}
