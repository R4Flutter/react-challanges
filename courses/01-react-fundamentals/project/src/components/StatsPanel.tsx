interface StatsPanelProps {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
  categoryBreakdown?: Record<string, number>
  priorityBreakdown?: Record<string, number>
}

export default function StatsPanel({
  total = 0,
  completed = 0,
  active = 0,
  overdue = 0,
  completedPercentage = 0,
  categoryBreakdown,
  priorityBreakdown,
}: StatsPanelProps) {
  return (
    <div id="stats-panel">
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Active: {active}</p>
      <p>Overdue: {overdue}</p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completedPercentage}
        aria-label="Completion"
      >
        <div style={{ width: `${completedPercentage}%` }} />
      </div>
      <p>Completion: {completedPercentage}%</p>
      {categoryBreakdown && (
        <div id="stats-categories">
          {Object.entries(categoryBreakdown).map(([category, count]) => (
            <p key={category}>
              {category}: {count}
            </p>
          ))}
        </div>
      )}
      {priorityBreakdown && (
        <div id="stats-priorities">
          {Object.entries(priorityBreakdown).map(([priority, count]) => (
            <p key={priority}>
              {priority}: {count}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}