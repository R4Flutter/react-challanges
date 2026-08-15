interface StatusIndicatorProps {
  status?: string
}

const LABELS: Record<string, string> = {
  overdue: 'Overdue',
  'due-today': 'Due Today',
  'due-soon': 'Due Soon',
  completed: 'Completed',
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === undefined || status === '') {
    return null
  }
  return (
    <span className="status-indicator" data-status={status}>
      {LABELS[status] ?? status}
    </span>
  )
}