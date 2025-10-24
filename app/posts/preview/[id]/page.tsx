import { directus, readItem, withToken } from '@/lib/directus';
import { redirect } from 'next/navigation';

export default async function Page({
  params, searchParams
}: {
  params: Promise<{ id: string}>;
  searchParams: Promise<{ preview: boolean, token: string, version: string | undefined }>;
}) {
  const id = (await params).id;
  const {preview, token, version} = (await searchParams)


  const post = await directus.request(withToken(token, readItem('posts', id, {
    fields: ['id', 'title', 'content', 'slug', 'published'],
    ...(version && { version }),
  })));

  if (!preview) {
    redirect(`/posts/${post.slug}`);
  }

  return (
    <>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </>
  );
}
