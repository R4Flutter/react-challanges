import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StoreProvider from './providers/StoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js App Router Project',
  description: 'Complete challenges to build your Next.js skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
