export default function Loading() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '1rem',
      }}
    >
      <div
        aria-label="Loading posts"
        style={{
          width: 48,
          height: 48,
          border: '4px solid #eee',
          borderTopColor: '#0070f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p>Loading posts…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
