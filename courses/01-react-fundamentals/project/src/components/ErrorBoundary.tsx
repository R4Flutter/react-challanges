import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(): void {}

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-fallback" role="alert">
          <h2>Something went wrong</h2>
          <p>Please try again.</p>
          <button id="error-retry" type="button" onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}