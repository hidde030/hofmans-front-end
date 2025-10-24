import { directus, readItems } from '@/lib/directus';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const posts = await directus.request(readItems('posts', {
    filter: {
			slug: { _eq: slug }
		},
		fields: ['id', 'title', 'content', 'slug', 'published'],
		limit: 1
  }));

  const post = posts[0];

  return (
    <>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </>
  );
}
