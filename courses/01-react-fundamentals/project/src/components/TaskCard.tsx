import { useState } from 'react'
import type { TaskUpdates } from './TaskList'

interface TaskCardProps {
  id?: string | number
  taskId?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: TaskUpdates) => void
  editingId?: string | number | null
  onStartEdit?: (id: string | number | null) => void
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
  onUpdateTask,
  editingId = null,
  onStartEdit,
}: TaskCardProps) {
  const taskIdentifier: string | number = id ?? taskId ?? ''
  const isEditing = editingId === taskIdentifier
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editPriority, setEditPriority] = useState(priority)
  const [error, setError] = useState('')

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      onDelete?.(taskIdentifier)
    }
  }

  const handleStartEdit = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setError('')
    onStartEdit?.(taskIdentifier)
  }

  const handleCancelEdit = () => {
    onStartEdit?.(null)
  }

  const handleSave = () => {
    if (!editTitle.trim()) {
      setError('Title is required')
      return
    }
    onUpdateTask?.(taskIdentifier, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    })
    onStartEdit?.(null)
  }

  if (isEditing) {
    return (
      <article id="task-card">
        <div>
          <label htmlFor={`edit-title-${taskIdentifier}`}>Title</label>
          <input
            id={`edit-title-${taskIdentifier}`}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`edit-description-${taskIdentifier}`}>Description</label>
          <textarea
            id={`edit-description-${taskIdentifier}`}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`edit-priority-${taskIdentifier}`}>Priority</label>
          <select
            id={`edit-priority-${taskIdentifier}`}
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {error && (
          <p id="task-edit-error" role="alert">
            {error}
          </p>
        )}
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={handleCancelEdit}>
          Cancel
        </button>
      </article>
    )
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
      {onUpdateTask && (
        <button type="button" onClick={handleStartEdit}>
          Edit
        </button>
      )}
    </article>
  )
}