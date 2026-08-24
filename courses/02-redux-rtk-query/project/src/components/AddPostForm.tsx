import { useState } from 'react'
import { useAddPostMutation } from '../../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState(1)
  const [addPost, { isLoading, isSuccess, error }] = useAddPostMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addPost({ title, body, userId })
    setTitle('')
    setBody('')
  }

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <div>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Body:
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          User ID:
          <input type="number" value={userId} onChange={(e) => setUserId(Number(e.target.value))} min="1" max="3" required />
        </label>
      </div>
      <button type="submit" data-testid="add-post-submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
      {isSuccess && <p>Post added successfully!</p>}
      {error && <p>Error: {JSON.stringify(error)}</p>}
    </form>
  )
}