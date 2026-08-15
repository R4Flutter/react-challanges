import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Task } from './TaskList'
import { DEFAULT_CATEGORY } from './TaskList'
import TaskList from './TaskList'
import ErrorBoundary from './ErrorBoundary'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'
import Button from './Button'
import { useTheme } from '../contexts/ThemeContext'
import { ADD_TASK, TOGGLE_TASK, UPDATE_TASK } from '../reducers/taskReducer'
import type { TaskAction } from '../reducers/taskReducer'
import type { FilterValue, SortValue } from './FilterBar'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: TaskAction) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showSearch?: boolean
  showCategories?: boolean
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
  showCategories = false,
  showStatsPanel = false,
  onDelete,
}: TaskAppProps) {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [sortOrder, setSortOrder] = useState<SortValue>('Recently Added')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { theme, toggleTheme } = useTheme()

  const uniqueCategories = [
    ...new Set(
      tasks
        .map((t) => t.category ?? DEFAULT_CATEGORY)
        .filter((c) => c !== '' && c !== undefined)
    ),
  ]

  const formCategories = [...new Set([DEFAULT_CATEGORY, ...uniqueCategories])]

  const stats = useMemo(() => {
    const completedCount = tasks.filter((t) => t.completed).length
    const activeCount = tasks.length - completedCount
    const now = new Date()
    const overdueCount = tasks.filter((t) => {
      if (t.completed || t.dueDate === undefined || t.dueDate === '') {
        return false
      }
      const due = new Date(t.dueDate)
      return !Number.isNaN(due.getTime()) && due.getTime() < now.getTime()
    }).length
    const categoryBreakdown: Record<string, number> = {}
    const priorityBreakdown: Record<string, number> = {}
    for (const task of tasks) {
      const category = task.category ?? DEFAULT_CATEGORY
      categoryBreakdown[category] = (categoryBreakdown[category] ?? 0) + 1
      priorityBreakdown[task.priority] = (priorityBreakdown[task.priority] ?? 0) + 1
    }
    return {
      total: tasks.length,
      completed: completedCount,
      active: activeCount,
      overdue: overdueCount,
      completedPercentage: tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0,
      categoryBreakdown,
      priorityBreakdown,
    }
  }, [tasks])

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

  const handleToggle = useCallback(
    (id: string | number) => {
      if (setTasks) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
      } else if (dispatch) {
        dispatch({ type: TOGGLE_TASK, payload: id })
      }
    },
    [setTasks, dispatch]
  )

  const handleUpdateTask = useCallback(
    (id: string | number, updates: Partial<Task>) => {
      if (setTasks) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
      } else if (dispatch) {
        dispatch({ type: UPDATE_TASK, payload: { id, ...updates } })
      }
    },
    [setTasks, dispatch]
  )

  const handleAddTask = useCallback(
    (task: Task) => {
      if (setTasks) {
        setTasks((prev) => [...prev, task])
      } else if (dispatch) {
        dispatch({ type: ADD_TASK, payload: task })
      }
    },
    [setTasks, dispatch]
  )

  const displayedTasks = useMemo(() => {
    let visible = tasks
    if (showFilterBar) {
      if (filter === 'active') {
        visible = tasks.filter((t) => !t.completed)
      } else if (filter === 'completed') {
        visible = tasks.filter((t) => t.completed)
      }
    }

    if (showFilterBar && showCategories && categoryFilter !== 'all') {
      visible = visible.filter((t) => (t.category ?? DEFAULT_CATEGORY) === categoryFilter)
    }

    if (showFilterBar && showSearch && debouncedQuery.trim() !== '') {
      const query = debouncedQuery.trim().toLowerCase()
      visible = visible.filter(
        (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      )
    }

    return showFilterBar
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
          if (sortOrder === 'Due Date (Soonest First)') {
            const aTime = a.dueDate === undefined ? Number.POSITIVE_INFINITY : new Date(a.dueDate).getTime()
            const bTime = b.dueDate === undefined ? Number.POSITIVE_INFINITY : new Date(b.dueDate).getTime()
            return aTime - bTime
          }
          return 0
        })
      : visible
  }, [tasks, filter, sortOrder, debouncedQuery, categoryFilter, showFilterBar, showCategories, showSearch])

  const countText =
    countFormat === 'completed'
      ? `${tasks.filter((t) => t.completed).length} of ${tasks.length} completed`
      : showFilterBar
        ? `Showing ${displayedTasks.length} of ${tasks.length} tasks`
        : `${tasks.length} Task${tasks.length === 1 ? '' : 's'}`

  return (
    <div>
      <Button
        id="theme-toggle"
        type="button"
        variant="secondary"
        onClick={toggleTheme}
        data-active={undefined}
      >
        {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
      </Button>
      {showForm && <TaskForm onAddTask={handleAddTask} categories={showCategories ? formCategories : undefined} />}
      {showStatsPanel && (
        <StatsPanel
          total={stats.total}
          completed={stats.completed}
          active={stats.active}
          overdue={stats.overdue}
          completedPercentage={stats.completedPercentage}
          categoryBreakdown={stats.categoryBreakdown}
          priorityBreakdown={stats.priorityBreakdown}
        />
      )}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sortOrder}
          onSortChange={setSortOrder}
          search={showSearch ? searchQuery : undefined}
          onSearchChange={showSearch ? setSearchQuery : undefined}
          onClearSearch={showSearch ? () => setSearchQuery('') : undefined}
          categories={showCategories ? uniqueCategories : undefined}
          category={showCategories ? categoryFilter : undefined}
          onCategoryChange={showCategories ? setCategoryFilter : undefined}
        />
      )}
      {showSearch && searchQuery !== debouncedQuery && searchQuery !== '' && (
        <p id="searching-indicator">Searching...</p>
      )}
      {showFilterBar && displayedTasks.length === 0 && (
        <p id="filter-empty-message">No tasks match this filter</p>
      )}
      <ErrorBoundary>
        <TaskList
          tasks={displayedTasks}
          countText={countText}
          onToggle={handleToggle}
          onDelete={onDelete}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          onStartEdit={setEditingId}
        />
      </ErrorBoundary>
    </div>
  )
}
