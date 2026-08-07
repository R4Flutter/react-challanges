import TaskCard from './TaskCard'
export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'Task One', description: 'First task', priority: 'High', completed: false },
  { id: 2, title: 'Task Two', description: 'Second task', priority: 'Medium', completed: false },
  { id: 3, title: 'Task Three', description: 'Third task', priority: 'Low', completed: false },
]

export default function TaskList({ tasks, countText }: TaskListProps) {
  const items = tasks ?? DEFAULT_TASKS
  return (
    <section id="task-list">
      {countText != null && <p id="task-count">{countText}</p>}
      {items.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
        />
      ))}
    </section>
  )
}

