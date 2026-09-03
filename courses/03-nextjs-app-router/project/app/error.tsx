'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: '4rem auto',
        padding: '2rem',
        textAlign: 'center',
        border: '1px solid #f5c2c7',
        borderRadius: '8px',
        background: '#f8d7da',
        color: '#842029',
      }}
    >
      <h1>Something went wrong</h1>
      <p style={{ marginTop: '0.5rem' }}>{error.message || 'Unexpected error'}</p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#842029',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </main>
  );
}
