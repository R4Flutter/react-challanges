interface TaskCardProps {
  id?: string | number
  taskId?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  id,
  taskId,
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const taskIdentifier: string | number = id ?? taskId ?? ''

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      onDelete?.(taskIdentifier)
    }
  }

  return (
    <article id="task-card" data-completed={completed ? 'true' : undefined}>
      <h2 style={completed ? { textDecoration: 'line-through' } : undefined}>{title}</h2>
      <p style={completed ? { textDecoration: 'line-through' } : undefined}>{description}</p>
      <p>Priority: {priority}</p>
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(taskIdentifier)}
          aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
        />
      )}
      {onDelete && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  )
}
