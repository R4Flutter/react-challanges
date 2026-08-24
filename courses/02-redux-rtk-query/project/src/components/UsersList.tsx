import { useGetUsersQuery } from '../../api/apiSlice'

export default function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery()

  if (isLoading) {
    return <div data-testid="users-loading">Loading...</div>
  }

  if (error) {
    return <div data-testid="users-error">Error: {JSON.stringify(error)}</div>
  }

  return (
    <ul data-testid="users-list">
      {data?.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email} - {user.username}
        </li>
      ))}
    </ul>
  )
}