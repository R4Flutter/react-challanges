import { useGetPostByIdQuery } from '../../api/apiSlice'

interface PostDetailProps {
  postId: number
}

export default function PostDetail({ postId }: PostDetailProps) {
  const { data, isLoading, isError, error } = useGetPostByIdQuery(postId, {
    skip: !postId,
  })

  if (isLoading) {
    return <div data-testid="post-detail-loading">Loading post...</div>
  }

  if (isError) {
    return <div data-testid="post-detail-error">Error: {error instanceof Error ? error.message : String(error)}</div>
  }

  return (
    <div data-testid="post-detail">
      {data && (
        <>
          <h3>{data.title}</h3>
          <p>{data.body}</p>
        </>
      )}
    </div>
  )
}