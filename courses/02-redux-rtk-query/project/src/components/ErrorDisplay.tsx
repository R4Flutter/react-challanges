interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display">
      <p>Error: {error instanceof Error ? error.message : String(error)}</p>
      {onRetry && (
        <button data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}