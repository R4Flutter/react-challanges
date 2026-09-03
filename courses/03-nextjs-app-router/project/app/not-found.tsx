import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: '4rem auto',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1>404 – Not found</h1>
      <p style={{ marginTop: '0.5rem', color: '#555' }}>
        The page you were looking for does not exist.
      </p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link href="/">← Back to home</Link>
      </p>
    </main>
  );
}
