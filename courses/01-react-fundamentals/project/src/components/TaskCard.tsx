import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { TaskUpdates } from './TaskList'
import { DEFAULT_CATEGORY } from './TaskList'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'
import FormInput from './FormInput'

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
  linkToTaskDetail?: boolean
}

function formatDueDate(dueDate: string | number): string {
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString()
}

function getDueDateStatus(dueDate: string | number | undefined, completed: boolean) {
  if (dueDate === undefined || dueDate === null || dueDate === '') {
    return { status: '', overdue: false }
  }
  const date = new Date(dueDate)
  if (Number.isNaN(date.getTime())) {
    return { status: '', overdue: false }
  }
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfDue = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86400000)
  if (diffDays < 0) {
    return { status: 'overdue', overdue: !completed }
  }
  if (diffDays === 0) {
    return { status: 'due-today', overdue: false }
  }
  if (diffDays <= 3) {
    return { status: 'due-soon', overdue: false }
  }
  return { status: '', overdue: false }
}

function TaskCard({
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
  linkToTaskDetail = false,
}: TaskCardProps) {
  const taskIdentifier: string | number = id ?? taskId ?? ''
  const taskCategory = category ?? DEFAULT_CATEGORY
  const { status: dueStatus, overdue: isOverdue } = getDueDateStatus(dueDate, completed)
  const formattedDue = dueDate !== undefined && dueDate !== '' ? formatDueDate(dueDate) : ''
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

  const isEditing = editingId === taskIdentifier

  if (isEditing) {
    return (
      <article id="task-card">
        <FormInput
          id={`edit-title-${taskIdentifier}`}
          label="Title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
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
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancelEdit}>
          Cancel
        </Button>
      </article>
    )
  }

  return (
    <article
      id="task-card"
      data-completed={completed ? 'true' : undefined}
      data-overdue={isOverdue ? 'true' : undefined}
    >
      <h2 style={completed ? { textDecoration: 'line-through' } : undefined}>
        {linkToTaskDetail && taskIdentifier !== '' ? (
          <Link to={`/challenge/21-react-router/task/${taskIdentifier}`}>{title}</Link>
        ) : (
          title
        )}
      </h2>
      <p style={completed ? { textDecoration: 'line-through' } : undefined}>{description}</p>
      <p>
        Priority: <Badge variant="priority">{priority}</Badge>
      </p>
      {(dueStatus !== '' || formattedDue !== '') && (
        <p id="task-due-date">
          {formattedDue !== '' && `Due: ${formattedDue}`}
          {dueStatus !== '' && <StatusIndicator status={dueStatus} />}
        </p>
      )}
      <p id="task-category">
        Category: <Badge variant="category">{taskCategory}</Badge>
      </p>
      <div id="task-tags">
        {tags.map((tag) => (
          <Badge key={tag} variant="tag" label={tag}>
            {tag}
          </Badge>
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
        <Button type="button" variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      )}
      {onUpdateTask && (
        <Button type="button" variant="secondary" onClick={handleStartEdit}>
          Edit
        </Button>
      )}
    </article>
  )
}

export default React.memo(TaskCard)