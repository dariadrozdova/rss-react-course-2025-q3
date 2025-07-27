import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from '@components/ErrorBoundary';

import ThrowingComponent from '@/__tests__/utils/ThrowingComponent';

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let mockWindowReload: ReturnType<typeof vi.fn>;
  let originalWindowLocation: Location;

  beforeEach(() => {
    originalWindowLocation = window.location;

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockWindowReload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalWindowLocation,
        reload: mockWindowReload,
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalWindowLocation,
    });
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child Component Content')).toBeInTheDocument();
    expect(
      screen.queryByText('Oops! Something went wrong.')
    ).not.toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('displays the fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'We are sorry, but an unexpected error occurred. Please try refreshing the page.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /refresh page/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('Normal Child Content')).not.toBeInTheDocument();
  });

  it('logs the error to console when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'getDerivedStateFromError called:',
      expect.any(Error)
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    const errorCalls = consoleWarnSpy.mock.calls.filter(
      (call) => call[0] === 'ErrorBoundary caught an error:'
    );
    expect(errorCalls).toHaveLength(1);
    expect((errorCalls[0][1] as Error).message).toBe(
      'Test error from ThrowingComponent'
    );
  });

  it('calls window.location.reload when the refresh button is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh page/i });
    fireEvent.click(refreshButton);

    expect(mockWindowReload).toHaveBeenCalledTimes(1);
  });
});
