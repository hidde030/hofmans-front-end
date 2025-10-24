interface DirectusSchema {
  posts: Post[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
}
