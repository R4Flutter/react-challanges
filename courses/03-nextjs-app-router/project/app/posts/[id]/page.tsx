import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Post = {
  id: number;
  title: string;
  body: string;
};

type Params = { id: string };

async function fetchPost(id: number): Promise<Post | null> {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Post;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0 || id > 100) {
    return { title: 'Post not found' };
  }
  const post = await fetchPost(id);
  if (!post) {
    return { title: 'Post not found' };
  }
  return {
    title: `${post.title} – Next.js App Router`,
    description: post.body.slice(0, 140),
  };
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0 || id > 100) {
    notFound();
  }
  const post = await fetchPost(id);
  if (!post) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <Link href="/posts">← Back to posts</Link>
      </nav>
      <article>
        <h1>{post!.title}</h1>
        <p style={{ color: '#555' }}>{post!.body}</p>
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          Post id: {post!.id}
        </p>
      </article>
    </main>
  );
}
