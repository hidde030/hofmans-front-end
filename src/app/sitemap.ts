import { useDirectus } from '@/lib/directus/directus';
import type { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

const DEFAULT_PRIORITIES: Record<string, number> = {
	pages: 0.7,
	services: 0.8,
	posts: 0.6,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hofmans-drukkerij.nl';
	const { directus, readItems } = useDirectus();

	const fetchPages = async (): Promise<SitemapEntry[]> => {
		try {
			const pages = await directus.request(
				readItems('pages', {
					filter: { status: { _eq: 'published' } },
					fields: ['permalink', 'published_at', 'date_updated', 'seo'],
					limit: -1,
				}),
			);

			return pages
				.filter((page: any) => page.permalink && !page.seo?.no_index)
				.map((page: any) => ({
					url: `${siteUrl}${page.permalink}`,
					lastModified: page.published_at || page.date_updated ? new Date(page.published_at || page.date_updated) : new Date(),
					changeFrequency: page.seo?.sitemap?.change_frequency || 'weekly' as const,
					priority: page.seo?.sitemap?.priority
						? parseFloat(page.seo.sitemap.priority)
						: page.permalink === '/'
							? 1.0
							: DEFAULT_PRIORITIES.pages,
				}));
		} catch (error) {
			console.error('Error fetching pages for sitemap:', error);
			return [];
		}
	};

	const fetchServices = async (): Promise<SitemapEntry[]> => {
		try {
			const services = await directus.request(
				readItems('services', {
					filter: { status: { _eq: 'published' } },
					fields: ['slug', 'date_updated', 'seo'],
					limit: -1,
				}),
			);

			return services
				.filter((service: any) => service.slug && !service.seo?.no_index)
				.map((service: any) => ({
					url: `${siteUrl}/diensten/${service.slug}`,
					lastModified: service.date_updated ? new Date(service.date_updated) : new Date(),
					changeFrequency: service.seo?.sitemap?.change_frequency || 'weekly' as const,
					priority: service.seo?.sitemap?.priority
						? parseFloat(service.seo.sitemap.priority)
						: DEFAULT_PRIORITIES.services,
				}));
		} catch (error) {
			console.error('Error fetching services for sitemap:', error);
			return [];
		}
	};

	const fetchPosts = async (): Promise<SitemapEntry[]> => {
		try {
			const posts = await directus.request(
				readItems('posts', {
					filter: { status: { _eq: 'published' } },
					fields: ['slug', 'published_at', 'date_updated', 'seo'],
					limit: -1,
				}),
			);

			return posts
				.filter((post: any) => post.slug && !post.seo?.no_index)
				.map((post: any) => ({
					url: `${siteUrl}/blog/${post.slug}`,
					lastModified: post.published_at || post.date_updated ? new Date(post.published_at || post.date_updated) : new Date(),
					changeFrequency: post.seo?.sitemap?.change_frequency || 'monthly' as const,
					priority: post.seo?.sitemap?.priority
						? parseFloat(post.seo.sitemap.priority)
						: DEFAULT_PRIORITIES.posts,
				}));
		} catch (error) {
			console.error('Error fetching posts for sitemap:', error);
			return [];
		}
	};

	const [pageEntries, serviceEntries, postEntries] = await Promise.all([
		fetchPages(),
		fetchServices(),
		fetchPosts(),
	]);

	return [...pageEntries, ...serviceEntries, ...postEntries];
}
