import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';
import ThrowingComponent from '../../utils/ThrowingComponent';

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let mockWindowReload: ReturnType<typeof vi.fn>;
  let originalWindowLocation: Location;

  beforeEach(() => {
    originalWindowLocation = window.location;

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

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
  });

  it('displays the fallback UI when a child component throws an error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /refresh page/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('Normal Child Content')).not.toBeInTheDocument();
  });

  it('logs the error to console.error when an error occurs', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Error),
      expect.stringContaining('The above error occurred'),
      expect.stringContaining(
        'React will try to recreate this component tree from scratch'
      )
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    expect((consoleErrorSpy.mock.calls[1][1] as Error).message).toBe(
      'Test error from ThrowingComponent'
    );
  });

  it('calls window.location.reload when the refresh button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh page/i });
    fireEvent.click(refreshButton);

    expect(mockWindowReload).toHaveBeenCalledTimes(1);
  });
});
