import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useGetPostsQuery } from '../api/apiSlice'
import { setSortBy, setFilterUserId } from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const dispatch = useAppDispatch()
  const { data: posts, isLoading, error } = useGetPostsQuery()
  const { sortBy, filterUserId } = useAppSelector((state) => state.filters)

  if (isLoading) return <div data-testid="posts-with-filters">Loading...</div>
  if (error) return <div data-testid="posts-with-filters">Error</div>

  let filtered = posts ?? []
  if (filterUserId !== null) {
    filtered = filtered.filter((p) => p.userId === filterUserId)
  }
  filtered = [...filtered].sort((a, b) =>
    sortBy === 'newest' ? b.id - a.id : a.id - b.id
  )

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <label>
          Sort:
          <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value as 'newest' | 'oldest'))}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
        <label>
          Filter by User:
          <select value={filterUserId ?? ''} onChange={(e) => dispatch(setFilterUserId(e.target.value ? Number(e.target.value) : null))}>
            <option value="">All</option>
            <option value="1">User 1</option>
            <option value="2">User 2</option>
            <option value="3">User 3</option>
          </select>
        </label>
      </div>
      <ul>
        {filtered.map((post) => (
          <li key={post.id}>{post.title} (user {post.userId})</li>
        ))}
      </ul>
    </div>
  )
}