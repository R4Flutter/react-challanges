import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task } from './TaskList'
import { DEFAULT_CATEGORY } from './TaskList'
import FormInput from './FormInput'
import Button from './Button'

const DEFAULT_CATEGORIES = ['General', 'Work', 'Personal']

interface TaskFormProps {
  onAddTask?: (task: Task) => void
  categories?: string[]
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')
}

export default function TaskForm({ onAddTask, categories }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [tagsInput, setTagsInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const categoryOptions = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES

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
      category,
      tags: parseTags(tagsInput),
      dueDate: dueDate !== '' ? dueDate : undefined,
      completed: false,
    })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory(DEFAULT_CATEGORY)
    setTagsInput('')
    setDueDate('')
    setError('')
  }

  return (
    <form id="task-form" onSubmit={handleSubmit}>
      <FormInput
        id="task-title"
        label="Title"
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
      <div>
        <label htmlFor="task-form-category">Category</label>
        <select
          id="task-form-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <FormInput
        id="task-form-tags"
        label="Tags"
        type="text"
        placeholder="Comma separated tags"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      <div>
        <label htmlFor="task-form-due-date">Due date</label>
        <input
          id="task-form-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {error && (
        <p id="task-form-error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit">Add Task</Button>
    </form>
  )
}