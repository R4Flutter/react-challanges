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

export const DEFAULT_CATEGORY = 'General'

export interface TaskUpdates {
  title: string
  description: string
  priority: string
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (id: string | number, updates: TaskUpdates) => void
  editingId?: string | number | null
  onStartEdit?: (id: string | number | null) => void
  linkToTaskDetail?: boolean
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'Task One', description: 'First task', priority: 'High', completed: false, category: 'General', tags: [] },
  { id: 2, title: 'Task Two', description: 'Second task', priority: 'Medium', completed: false, category: 'General', tags: [] },
  { id: 3, title: 'Task Three', description: 'Third task', priority: 'Low', completed: false, category: 'General', tags: [] },
]

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  onStartEdit,
  linkToTaskDetail = false,
}: TaskListProps) {
  const items = tasks ?? DEFAULT_TASKS
  return (
    <section id="task-list">
      {countText != null && <p id="task-count">{countText}</p>}
      {items.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          category={task.category}
          tags={task.tags}
          dueDate={task.dueDate}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
          editingId={editingId}
          onStartEdit={onStartEdit}
          linkToTaskDetail={linkToTaskDetail}
        />
      ))}
    </section>
  )
}
