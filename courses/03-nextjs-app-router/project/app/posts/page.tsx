import Link from 'next/link'

type Post = {
  id: number
  title: string
  body: string
}

export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts: Post[] = await res.json()

  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Posts</h1>
        <p>Fetched data from the JSONPlaceholder API using an async Server Component.</p>
        <nav style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>
          <Link href="/">
            <button>Home</button>
          </Link>
        </nav>
      </header>
      <section>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
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
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{post.title}</h2>
                <p style={{ color: '#555' }}>{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}