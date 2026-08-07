import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task } from './TaskList'

interface TaskFormProps {
  onAddTask?: (task: Task) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    onAddTask?.({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setError('')
  }

  return (
    <form id="task-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      {error && (
        <p id="task-form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit">Add Task</button>
    </form>
  )
}
