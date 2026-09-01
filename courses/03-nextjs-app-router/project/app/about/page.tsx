import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'About - Next.js App Router Project',
  description: 'About page for the App Router project',
}

export default function About() {
  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>About</h1>
        <p>Learn about this Next.js App Router project.</p>
        <nav style={{ margin: '2rem auto', maxWidth: '600px', textAlign: 'center' }}>
          <Link href="/">
            <button>Home</button>
          </Link>
        </nav>
      </header>
    </main>
  )
}