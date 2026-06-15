export function organizationSchema(globals: {
	title?: string | null;
	url?: string | null;
	logo?: any;
	address?: string | null;
	zip_code?: string | null;
	city?: string | null;
	country?: string | null;
	phone?: string | null;
	email?: string | null;
	social_links?: Array<{ service: string; url: string }> | null;
}) {
	const sameAs = globals.social_links?.map((l) => l.url).filter(Boolean) || [];

	const json: Record<string, any> = {
		'@context': 'https://schema.org',
		'@type': ['Organization', 'LocalBusiness'],
		name: globals.title || undefined,
		url: globals.url || undefined,
	};

	if (globals.logo && typeof globals.logo === 'object' && 'id' in globals.logo) {
		json.logo = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${(globals.logo as any).id}`;
	}

	if (globals.address || globals.city) {
		json.address = {
			'@type': 'PostalAddress',
			...(globals.address && { streetAddress: globals.address }),
			...(globals.zip_code && { postalCode: globals.zip_code }),
			...(globals.city && { addressLocality: globals.city }),
			...(globals.country && { addressCountry: globals.country }),
		};
	}

	if (globals.phone) json.telephone = globals.phone;
	if (globals.email) json.email = globals.email;
	if (sameAs.length > 0) json.sameAs = sameAs;

	return json;
}

export function articleSchema(
	post: {
		title: string;
		description?: string | null;
		image?: any;
		published_at?: string | null;
		date_created?: string | null;
		date_updated?: string | null;
		slug?: string | null;
	},
	author: { first_name?: string | null; last_name?: string | null } | null,
) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
	const authorName = author ? [author.first_name, author.last_name].filter(Boolean).join(' ') : undefined;

	const json: Record<string, any> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
	};

	if (post.description) json.description = post.description;

	if (post.image && typeof post.image === 'string') {
		json.image = post.image.startsWith('http') ? post.image : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${post.image}`;
	}

	if (authorName) {
		json.author = { '@type': 'Person', name: authorName };
	}

	if (post.published_at) json.datePublished = post.published_at;
	if (post.date_updated) json.dateModified = post.date_updated;

	json.publisher = { '@type': 'Organization', name: globalsTitle };

	if (post.slug && siteUrl) {
		json.url = `${siteUrl}/blog/${post.slug}`;
		json.mainEntityOfPage = { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` };
	}

	return json;
}

const globalsTitle = 'Hofmans Drukkerij';

export function serviceSchema(
	service: {
		title: string;
		description?: string | null;
		image?: any;
		slug?: string | null;
	},
) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const json: Record<string, any> = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.title,
		provider: { '@type': 'Organization', name: globalsTitle },
	};

	if (service.description) json.description = service.description;

	if (service.image && typeof service.image === 'string') {
		json.image = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${service.image}`;
	} else if (service.image && typeof service.image === 'object' && 'id' in service.image) {
		json.image = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${(service.image as any).id}`;
	}

	if (service.slug && siteUrl) {
		json.url = `${siteUrl}/diensten/${service.slug}`;
	}

	return json;
}

export function webpageSchema(
	page: { title: string; description?: string | null },
	url: string,
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: page.title,
		...(page.description && { description: page.description }),
		url,
	};
}

export function breadcrumbSchema(items: Array<{ name: string; url?: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			...(item.url && { item: item.url }),
		})),
	};
}

export function serializeJsonLd(data: Record<string, any>): string {
	return JSON.stringify(data, null, 2);
}
