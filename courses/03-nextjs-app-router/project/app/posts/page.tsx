import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { refreshPosts } from '../actions';

// Force per-request SSR (Challenge 08) and dynamic rendering (Challenge 07).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = {
  id: number;
  title: string;
  body: string;
};

type SearchParams = { q?: string; page?: string };

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  return (await res.json()) as Post[];
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const allPosts = await fetchPosts();
  const q = (searchParams?.q ?? '').toLowerCase();
  const pageNum = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const pageSize = 10;

  const filtered = q
    ? allPosts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
      )
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (pageNum - 1) * pageSize;
  const posts = filtered.slice(start, start + pageSize);

  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Posts</h1>
        <p>
          Fetched data from the JSONPlaceholder API using an async Server Component with
          dynamic rendering.
        </p>
        <form
          action={async (formData) => {
            'use server';
            const query = String(formData.get('q') ?? '');
            const page = String(formData.get('page') ?? '1');
            revalidatePath('/posts');
            // Server actions can use redirect for navigation; here we just refresh.
            await refreshPosts(query, page);
          }}
          style={{
            margin: '1rem auto',
            maxWidth: '600px',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={searchParams?.q ?? ''}
            placeholder="Search posts…"
            style={{ flex: 1, padding: '0.5rem' }}
            aria-label="Search posts"
          />
          <input type="hidden" name="page" value="1" />
          <button type="submit">Search</button>
        </form>
        <nav style={{ margin: '1rem auto', maxWidth: '600px', textAlign: 'center' }}>
          <Link href="/">Home</Link>
        </nav>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Page {pageNum} of {totalPages} · {filtered.length} match
          {filtered.length === 1 ? '' : 'es'}
        </p>
      </header>
      <section>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No posts found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, maxWidth: 720, margin: '0 auto' }}>
            {posts.map((post) => (
              <li
                key={post.id}
                style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p style={{ color: '#555' }}>{post.body}</p>
              </li>
            ))}
          </ul>
        )}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {pageNum > 1 && (
            <Link href={`/posts?q=${encodeURIComponent(q)}&page=${pageNum - 1}`}>
              ← Previous
            </Link>
          )}
          {pageNum < totalPages && (
            <Link href={`/posts?q=${encodeURIComponent(q)}&page=${pageNum + 1}`}>
              Next →
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}
