import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import type { FilterValue, SortValue } from './FilterBar'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showSearch?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

export default function TaskApp({
  tasks = [],
  setTasks,
  dispatch,
  showForm = false,
  countFormat = 'tasks',
  showFilterBar = false,
  showSearch = false,
  onDelete,
}: TaskAppProps) {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [sortOrder, setSortOrder] = useState<SortValue>('Recently Added')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    if (searchQuery === debouncedQuery) {
      return
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery, debouncedQuery])

  const handleToggle = (id: string | number) => {
    if (setTasks) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    } else if (dispatch) {
      dispatch({ type: 'TOGGLE_TASK', payload: id })
    }
  }

  const handleUpdateTask = (id: string | number, updates: Partial<Task>) => {
    if (setTasks) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    } else if (dispatch) {
      dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } })
    }
  }

  const handleAddTask = (task: Task) => {
    if (setTasks) {
      setTasks((prev) => [...prev, task])
    } else if (dispatch) {
      dispatch({ type: 'ADD_TASK', payload: task })
    }
  }

  let visible = tasks
  if (showFilterBar) {
    if (filter === 'active') {
      visible = tasks.filter((t) => !t.completed)
    } else if (filter === 'completed') {
      visible = tasks.filter((t) => t.completed)
    }
  }

  if (showFilterBar && showSearch && debouncedQuery.trim() !== '') {
    const query = debouncedQuery.trim().toLowerCase()
    visible = visible.filter(
      (t) =>
        t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
    )
  }

  const displayedTasks = showFilterBar
    ? [...visible].sort((a, b) => {
        if (sortOrder === 'Alphabetical') {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        }
        if (sortOrder === 'Priority: High to Low') {
          return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
        }
        if (sortOrder === 'Priority: Low to High') {
          return (PRIORITY_ORDER[b.priority] ?? 1) - (PRIORITY_ORDER[a.priority] ?? 1)
        }
        return 0
      })
    : visible

  const countText =
    countFormat === 'completed'
      ? `${tasks.filter((t) => t.completed).length} of ${tasks.length} completed`
      : showFilterBar
        ? `Showing ${displayedTasks.length} of ${tasks.length} tasks`
        : `${tasks.length} Task${tasks.length === 1 ? '' : 's'}`

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sortOrder}
          onSortChange={setSortOrder}
          search={showSearch ? searchQuery : undefined}
          onSearchChange={showSearch ? setSearchQuery : undefined}
          onClearSearch={showSearch ? () => setSearchQuery('') : undefined}
        />
      )}
      {showSearch && searchQuery !== debouncedQuery && searchQuery !== '' && (
        <p id="searching-indicator">Searching...</p>
      )}
      {showFilterBar && displayedTasks.length === 0 && (
        <p id="filter-empty-message">No tasks match this filter</p>
      )}
      <TaskList
        tasks={displayedTasks}
        countText={countText}
        onToggle={handleToggle}
        onDelete={onDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        onStartEdit={setEditingId}
      />
    </div>
  )
}
