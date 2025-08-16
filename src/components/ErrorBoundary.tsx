import type { ErrorInfo } from 'react';
import { Component } from 'react';

import Button from './Button';

import type { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/';
import { cn } from '@/utils/classNames';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.warn('getDerivedStateFromError called:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn(`flex flex-col items-center justify-center
            min-h-[80vh] text-center p-5
            bg-error-background border-2 border-error-border rounded-lg
            shadow-md shadow-black-alpha-10 font-sans
            w-full`)}
        >
          <h1 className={cn('text-error-text-dark text-[2.5em] mb-[0.9em]')}>
            Oops! Something went wrong.
          </h1>
          <p
            className={cn(
              'text-error-text-medium text-[1.2em] mb-[1.56em] max-w-xl leading-relaxed'
            )}
          >
            We are sorry, but an unexpected error occurred. Please try
            refreshing the page.
          </p>
          <Button
            className={cn(`px-[25px] py-3 rounded-lg text-[1.1em] normal-case
              shadow-md shadow-black-alpha-15
              hover:-translate-y-0.5
              active:shadow-black-alpha-15`)}
            color="green"
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
