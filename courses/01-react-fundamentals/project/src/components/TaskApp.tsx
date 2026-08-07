import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp({
  tasks = [],
  setTasks,
  dispatch,
  showForm = false,
  countFormat = 'tasks',
}: TaskAppProps) {
  const countText =
    countFormat === 'completed'
      ? `${tasks.filter((t) => t.completed).length} Completed`
      : `${tasks.length} Task${tasks.length === 1 ? '' : 's'}`

  const handleAddTask = (task: Task) => {
    if (setTasks) {
      setTasks((prev) => [...prev, task])
    } else if (dispatch) {
      dispatch({ type: 'ADD_TASK', payload: task })
    }
  }

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      <TaskList tasks={tasks} countText={countText} />
    </div>
  )
}
