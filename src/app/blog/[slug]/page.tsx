import { draftMode } from 'next/headers';
import { fetchPostBySlug, fetchSiteData } from '@/lib/directus/fetchers';
import BlogPostClient from './BlogPostClient';
import type { DirectusUser } from '@/types/directus-schema';

export default async function BlogPostPage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ preview?: string; token?: string }>;
}) {
	const { slug } = await params;
	const { preview, token } = await searchParams;

	const isDraft = preview === 'true' && !!token;

	try {
		const [{ post, relatedPosts }, { globals, headerNavigation }] = await Promise.all([
			fetchPostBySlug(slug, {
				draft: isDraft,
				token,
			}),
			fetchSiteData(),
		]);

		if (!post) {
			return <div className="text-center text-xl mt-[20%]">404 - Post Not Found</div>;
		}

		const author = post.author as DirectusUser | null;
		const authorName = author ? [author.first_name, author.last_name].filter(Boolean).join(' ') : '';
		const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;

		return (
			<BlogPostClient
				post={post}
				relatedPosts={relatedPosts}
				author={author}
				authorName={authorName}
				postUrl={postUrl}
				isDraft={isDraft}
				headerNavigation={headerNavigation}
				globals={globals}
			/>
		);
	} catch (error) {
		console.error('Error loading blog post:', error);

		return <div className="text-center text-xl mt-[20%]">404 - Post Not Found</div>;
	}
}
