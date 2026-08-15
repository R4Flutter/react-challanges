import { useState } from 'react'
import type { TaskUpdates } from './TaskList'
import { DEFAULT_CATEGORY } from './TaskList'

interface TaskCardProps {
  id?: string | number
  taskId?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: TaskUpdates) => void
  editingId?: string | number | null
  onStartEdit?: (id: string | number | null) => void
}

function formatDueDate(dueDate: string | number): string {
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString()
}

function getDueDateLabel(dueDate: string | number | undefined, completed: boolean) {
  if (dueDate === undefined || dueDate === null || dueDate === '') {
    return { label: '', overdue: false }
  }
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) {
    return { label: '', overdue: false }
  }
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfDue = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86400000)
  if (diffDays < 0) {
    return { label: completed ? 'Overdue' : 'Overdue', overdue: !completed }
  }
  if (diffDays === 0) {
    return { label: 'Due Today', overdue: false }
  }
  if (diffDays <= 3) {
    return { label: 'Due Soon', overdue: false }
  }
  return { label: '', overdue: false }
}

export default function TaskCard({
  id,
  taskId,
  title,
  description,
  priority,
  completed = false,
  category,
  tags = [],
  dueDate,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId = null,
  onStartEdit,
}: TaskCardProps) {
  const taskIdentifier: string | number = id ?? taskId ?? ''
  const taskCategory = category ?? DEFAULT_CATEGORY
  const dueLabel = getDueDateLabel(dueDate, completed)
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
    <article
      id="task-card"
      data-completed={completed ? 'true' : undefined}
      data-overdue={dueLabel.overdue ? 'true' : undefined}
    >
      <h2 style={completed ? { textDecoration: 'line-through' } : undefined}>{title}</h2>
      <p style={completed ? { textDecoration: 'line-through' } : undefined}>{description}</p>
      <p>Priority: {priority}</p>
      {(dueLabel.label !== '' || (dueDate !== undefined && dueDate !== '')) && (
        <p id="task-due-date">
          {dueLabel.label !== '' ? dueLabel.label : `Due: ${formatDueDate(dueDate as string | number)}`}
        </p>
      )}
      <p id="task-category">Category: {taskCategory}</p>
      <div id="task-tags">
        {tags.map((tag) => (
          <span key={tag} data-tag={tag} className="task-tag">
            {tag}
          </span>
        ))}
      </div>
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