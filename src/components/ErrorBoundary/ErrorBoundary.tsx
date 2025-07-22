import { Component, type ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.css';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../../types/types';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log('getDerivedStateFromError called:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorFallbackContainer}>
          <h1 className={styles.errorTitle}>Oops! Something went wrong.</h1>
          <p className={styles.errorMessage}>
            We are sorry, but an unexpected error occurred. Please try
            refreshing the page.
          </p>
          <button
            className={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
