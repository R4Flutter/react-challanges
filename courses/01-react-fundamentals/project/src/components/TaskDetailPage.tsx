import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Task } from './TaskList'

const STORAGE_KEY = 'task-app-tasks'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === null) {
        setTask(null)
        return
      }
      const tasks = JSON.parse(raw) as Task[]
      const found = tasks.find((t) => String(t.id) === id)
      setTask(found ?? null)
    } catch {
      setTask(null)
    }
  }, [id])

  return (
    <div id="task-detail-page">
      {task ? (
        <>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.completed ? 'Completed' : 'Active'}</p>
          {task.category && <p>Category: {task.category}</p>}
          {task.tags && task.tags.length > 0 && <p>Tags: {task.tags.join(', ')}</p>}
          {task.dueDate && task.dueDate !== '' && (
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          )}
        </>
      ) : (
        <p>Task not found</p>
      )}
      <button
        id="task-detail-back"
        type="button"
        onClick={() => navigate('/challenge/21-react-router')}
      >
        Back to list
      </button>
    </div>
  )
}