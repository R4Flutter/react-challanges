import { NextResponse } from 'next/server'

type Post = {
  id: number
  title: string
  body: string
}

export async function GET() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts: Post[] = await res.json()
  return NextResponse.json(posts)
}