import Image from 'next/image'
import Link from 'next/link'
import ChallengeList from './components/ChallengeList'

export default function Home() {
  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Next.js App Router Project</h1>
        <p>Complete the challenges to build your Next.js skills!</p>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Work on challenges by modifying code in <code>app/</code> directory.
          Run <code>npm run dev</code> to see your changes.
        </p>
        <nav style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/posts">Posts</Link>
        </nav>
        <div style={{ marginTop: '1rem' }}>
          <Image
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
        </div>
      </header>
      <ChallengeList />
    </main>
  )
}
