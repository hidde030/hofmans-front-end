import { BlockPost, PageBlock, Post, Redirect, Schema, Service } from '@/types/directus-schema';
import { useDirectus } from './directus';
import { readItems, aggregate, readItem, readSingleton, withToken, QueryFilter } from '@directus/sdk';
import { RedirectError } from '../redirects';

export const fetchServiceData = async (slug: string) => {
	const { directus, readItems } = useDirectus();

	try {
		const serviceData = await directus.request(
			readItems('services', {
				filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
				limit: 1,
				fields: [
					'id',
					'title',
					'description',
					'image',
					'seo',
					{
						blocks: [
							'id',
							'collection',
							'item',
							'sort',
							{
								item: {
									block_richtext: ['id', 'tagline', 'headline', 'content', 'alignment'],
									block_text_image: [
										'id',
										'tagline',
										'headline',
										'content',
										'image',
										'image_position',
										'border',
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_gallery: [
										'id',
										'tagline',
										'headline',
										'display_type',
										'disable_lightbox',
										'alignment',
										{ items: ['*'] },
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									] as any,
									block_pricing: [
										'id',
										'tagline',
										'headline',
										{
											pricing_cards: [
												'id',
												'title',
												'description',
												'price',
												'badge',
												'features',
												'is_highlighted',
												{
													button: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_hero: [
										'id',
										'tagline',
										'headline',
										'subtitle',
										'description',
										'phone',
										'email',
										'layout',
										'image',
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_posts: ['id', 'tagline', 'headline', 'collection', 'limit'],
									block_button_group: [
										'id',
										{
											buttons: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }],
										},
									],
									block_related_service: [
										'id',
										'headline',
										{
											services: [{ services_id: ['id', 'title', 'slug', 'image'] }],
										},
									],
									block_services_grid: ['id', 'tagline', 'headline'],
									block_form: [
										'id',
										'tagline',
										'headline',
										{
											form: [
												'id',
												'title',
												'submit_label',
												'success_message',
												'on_success',
												'success_redirect_url',
												'is_active',
												{
													fields: [
														'id',
														'name',
														'type',
														'label',
														'placeholder',
														'help',
														'validation',
														'width',
														'choices',
														'required',
														'sort',
													],
												},
											],
										},
									],
								},
							},
						],
					},
				],
				deep: {
					blocks: { _sort: ['sort'] },
				},
			}),
		);

		if (!serviceData.length) {
			throw new Error('Service not found');
		}

		return serviceData[0];
	} catch (error) {
		console.error(`Error fetching service mapped to ${slug}:`, error);
		throw error;
	}
};

/**
 * Fetches page data by permalink, including all nested blocks and dynamically fetching blog posts if required.
 */
export const fetchPageData = async (permalink: string, postPage = 1) => {
	const { directus, readItems } = useDirectus();
	try {
		console.log(`[DEBUG] fetchPageData called for: "${permalink}"`);
		const pageData = await directus.request(
			readItems('pages', {
				filter: { permalink: { _eq: permalink } },
				limit: 1,
				fields: [
					'title',
					'seo',
					'id',
					'header_navigation',
					'header_background_color',
					'header_logo',
					'hide_home_link',
					{
						blocks: [
							'id',
							'background',
							'collection',
							'item',
							'sort',
							'hide_block',
							{
								item: {
									block_richtext: ['id', 'tagline', 'headline', 'content', 'alignment'],
									block_text_image: [
										'id',
										'tagline',
										'headline',
										'content',
										'image',
										'image_position',
										'border',
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_gallery: [
										'id',
										'tagline',
										'headline',
										'display_type',
										'disable_lightbox',
										'alignment',
										{ items: ['*'] },
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									] as any,
									block_pricing: [
										'id',
										'tagline',
										'headline',
										{
											pricing_cards: [
												'id',
												'title',
												'description',
												'price',
												'badge',
												'features',
												'is_highlighted',
												{
													button: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_hero: [
										'id',
										'tagline',
										'headline',
										'subtitle',
										'description',
										'phone',
										'email',
										'layout',
										'alignment',
										'full_width',
										'image',
										{
											button_group: [
												'id',
												{
													buttons: [
														'id',
														'label',
														'variant',
														'url',
														'type',
														{ page: ['permalink'] },
														{ post: ['slug'] },
													],
												},
											],
										},
									],
									block_posts: ['id', 'tagline', 'headline', 'collection', 'limit'],
									block_button_group: [
										'id',
										{
											buttons: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }],
										},
									],
									block_related_service: [
										'id',
										'headline',
										{
											services: [{ services_id: ['id', 'title', 'slug', 'image'] }],
										},
									],
									block_services_grid: ['id', 'tagline', 'headline'],
									block_form: [
										'id',
										'tagline',
										'headline',
										{
											form: [
												'id',
												'title',
												'submit_label',
												'success_message',
												'on_success',
												'success_redirect_url',
												'is_active',
												{
													fields: [
														'id',
														'name',
														'type',
														'label',
														'placeholder',
														'help',
														'validation',
														'width',
														'choices',
														'required',
														'sort',
													],
												},
											],
										},
									],
								},
							},
						],
					},
				],
				deep: {
					blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
				},
			}),
		);
		if (!pageData.length) {
			console.warn(`[DEBUG] No page found in Directus for permalink: "${permalink}"`);
			throw new Error('Page not found');
		}

		console.log(`[DEBUG] Successfully fetched page: "${pageData[0].title}" (ID: ${pageData[0].id})`);
		const page = pageData[0];

		// If a custom header navigation is selected, fetch its items
		if (page.header_navigation) {
			try {
				const navId = typeof page.header_navigation === 'string' ? page.header_navigation : (page.header_navigation as any).id;
				if (navId) {
					const customNav = await fetchNavigation(navId);
					(page as any).custom_navigation = customNav;
				}
			} catch (err) {
				console.error(`Error fetching custom navigation "${page.header_navigation}":`, err);
			}
		}

		const textImageBlocks = (page.blocks as any[])?.filter((b: any) => b.collection === 'block_text_image');

		if (Array.isArray(page.blocks)) {
			for (const block of page.blocks as PageBlock[]) {
				if (
					block.collection === 'block_posts' &&
					block.item &&
					typeof block.item === 'object' &&
					(block.item as BlockPost).collection === 'posts'
				) {
					const limit = (block.item as BlockPost).limit ?? 6;
					const posts = await directus.request<Post[]>(
						readItems('posts', {
							fields: ['id', 'title', 'description', 'slug', 'image', 'status', 'published_at'],
							filter: { status: { _eq: 'published' } },
							sort: ['-published_at'],
							limit,
							page: postPage,
						}),
					);

					(block.item as BlockPost & { posts: Post[] }).posts = posts;
				} else if (block.collection === 'block_services_grid' && block.item && typeof block.item === 'object') {
					const services = await directus.request<Service[]>(
						readItems('services', {
							fields: ['id', 'title', 'slug', 'image'],
							filter: { status: { _eq: 'published' } },
							sort: ['sort'],
						}),
					);

					(block.item as any).services = services;
				}
			}
		}

		return page;
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Error('Failed to fetch page data');
	}
};

/**
 * Fetches site-wide navigation by ID/Slug.
 */
export const fetchNavigation = async (id: string) => {
	const { directus } = useDirectus();

	return await directus.request(
		readItem('navigation', id, {
			fields: [
				'id',
				'title',
				{
					items: [
						'id',
						'title',
						{
							page: ['permalink'],
							children: ['id', 'title', 'url', { page: ['permalink'] }],
						},
					],
				},
			],
			deep: { items: { _sort: ['sort'] } },
		}),
	);
};

/**
 * Fetches global site data, header navigation, and footer navigation.
 */
export const fetchSiteData = async () => {
	const { directus } = useDirectus();

	try {
		const [globals, headerNavigation, footerNavigation] = await Promise.all([
			directus.request(
				readSingleton('globals', {
					fields: [
						'id',
						'title',
						'description',
						'logo',
						'logo_dark_mode',
						'social_links',
						'accent_color',
						'favicon',
						'address',
						'zip_code',
						'city',
						'phone',
						'email',
					],
				}),
			),
			fetchNavigation('main'),
			directus.request(
				readItem('navigation', 'footer', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }],
								},
							],
						},
					],
				}),
			),
		]);

		return { globals, headerNavigation, footerNavigation };
	} catch (error) {
		console.error('Error fetching site data:', error);
		throw new Error('Failed to fetch site data');
	}
};

/**
 * Fetches a single blog post by slug and related blog posts excluding the given ID. Handles live preview mode.
 */
export const fetchPostBySlug = async (
	slug: string,
	options?: { draft?: boolean; token?: string },
): Promise<{ post: Post | null; relatedPosts: Post[] }> => {
	const { directus } = useDirectus();
	const { draft, token } = options || {};

	try {
		const filter: QueryFilter<Schema, Post> = options?.draft
			? { slug: { _eq: slug } }
			: { slug: { _eq: slug }, status: { _eq: 'published' } };
		let postRequest = readItems<Schema, 'posts', any>('posts', {
			filter,
			limit: 1,
			fields: [
				'id',
				'title',
				'content',
				'status',
				'published_at',
				'image',
				'description',
				'slug',
				'seo',
				{
					author: ['id', 'first_name', 'last_name', 'avatar'],
				},
			],
		});

		// This is a really naive implementation of related posts. Just a basic check to ensure we don't return the same post. You might want to do something more sophisticated.
		let relatedRequest = readItems<Schema, 'posts', any>('posts', {
			filter: { slug: { _neq: slug }, status: { _eq: 'published' } },
			limit: 2,
			fields: ['id', 'title', 'slug', 'image'],
		});

		if (draft && token) {
			postRequest = withToken(token, postRequest);
			relatedRequest = withToken(token, relatedRequest);
		}

		const [posts, relatedPosts] = await Promise.all([
			directus.request<Post[]>(postRequest),
			directus.request<Post[]>(relatedRequest),
		]);

		const post: Post | null = posts.length > 0 ? (posts[0] as Post) : null;

		return { post, relatedPosts };
	} catch (error) {
		console.error('Error in fetchPostBySlug:', error);
		throw new Error('Failed to fetch blog post and related posts');
	}
};

/**
 * Fetches paginated blog posts.
 */
export const fetchPaginatedPosts = async (limit: number, page: number) => {
	const { directus } = useDirectus();
	try {
		const response = await directus.request(
			readItems('posts', {
				limit,
				page,
				sort: ['-published_at'],
				fields: ['id', 'title', 'description', 'slug', 'image'],
				filter: { status: { _eq: 'published' } },
			}),
		);

		return response;
	} catch (error) {
		console.error('Error fetching paginated posts:', error);
		throw new Error('Failed to fetch paginated posts');
	}
};

/**
 * Fetches the total number of published blog posts.
 */
export const fetchTotalPostCount = async (): Promise<number> => {
	const { directus } = useDirectus();

	try {
		const response = await directus.request(
			aggregate('posts', {
				aggregate: { count: '*' },
				filter: { status: { _eq: 'published' } },
			}),
		);

		return Number(response[0]?.count) || 0;
	} catch (error) {
		console.error('Error fetching total post count:', error);

		return 0;
	}
};

export async function fetchRedirects(): Promise<Pick<Redirect, 'url_from' | 'url_to' | 'response_code'>[]> {
	const { directus } = useDirectus();
	const response = await directus.request(
		readItems('redirects', {
			filter: {
				_and: [
					{
						url_from: { _nnull: true },
					},
					{
						url_to: { _nnull: true },
					},
				],
			},
			fields: ['url_from', 'url_to', 'response_code'],
		}),
	);

	return response || [];
}
