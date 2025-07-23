import type { ErrorBoundaryProps, ErrorBoundaryState } from '@types';
import type { ErrorInfo } from 'react';
import { Component } from 'react';

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
          className="
            flex flex-col items-center justify-center
            min-h-[80vh] text-center p-5
            bg-[hsl(0,100%,97%)] border-2 border-[hsl(0,60%,82%)] rounded-lg
            shadow-md shadow-[hsla(0,0%,0%,0.1)] m-5 font-sans
          "
        >
          <h1 className="text-[hsl(0,64%,47%)] text-[2.5em] mb-[15px]">
            Oops! Something went wrong.
          </h1>
          <p className="text-[hsl(0,70%,51%)] text-[1.2em] mb-[25px] max-w-[600px] leading-relaxed">
            We are sorry, but an unexpected error occurred. Please try
            refreshing the page.
          </p>
          <button
            className="
              px-[25px] py-3
              bg-[hsl(173,100%,23%)] text-[hsl(0,0%,100%)]
              border-none rounded-lg text-[1.1em] cursor-pointer
              transition-all duration-200 ease-in-out transform-gpu
              shadow-md shadow-[hsla(0,0%,0%,0.15)]
              hover:bg-[hsl(173,100%,15%)] hover:-translate-y-0.5
              active:translate-y-0 active:shadow-xs active:shadow-[hsla(0,0%,0%,0.15)]
            "
            onClick={() => {
              window.location.reload();
            }}
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
