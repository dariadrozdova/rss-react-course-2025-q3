import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import { act } from 'react';
import MainPage from '../pages/MainPage/MainPage';

vi.mock('../components/ErrorBoundary/ErrorBoundary', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../components/ErrorBoundary/ErrorBoundary')
    >();
  return {
    default: actual.default,
  };
});

vi.mock('../pages/MainPage/MainPage', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  const MockMainPage = vi.fn(() => {
    const [shouldThrow, setShouldThrow] = React.useState(false);

    if (shouldThrow) {
      throw new Error('Test error from MainPage for App.test');
    }

    return (
      <div data-testid="main-page">
        <button
          data-testid="throw-mainpage-error-button"
          onClick={() => setShouldThrow(true)}
        >
          Throw Error in MainPage
        </button>
        <p>MainPage Content</p>
      </div>
    );
  });

  return {
    default: MockMainPage,
  };
});

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

describe('App', () => {
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('renders MainPage component inside ErrorBoundary', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<MainPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByTestId('main-page')).toBeInTheDocument();
    expect(await screen.findByText('MainPage Content')).toBeInTheDocument();
  });

  it('displays ErrorBoundary fallback when MainPage throws an error', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<MainPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByTestId('main-page')).toBeInTheDocument();

    const throwButton = await screen.findByTestId(
      'throw-mainpage-error-button'
    );
    consoleErrorSpy.mockClear();

    await act(async () => {
      fireEvent.click(throwButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Oops! Something went wrong.')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'We are sorry, but an unexpected error occurred. Please try refreshing the page.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /refresh page/i })
      ).toBeInTheDocument();
    });

    expect(screen.queryByTestId('main-page')).not.toBeInTheDocument();
    expect(screen.queryByText('MainPage Content')).not.toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalled();

    const calls = consoleErrorSpy.mock.calls.flat();
    const error = calls.find(
      (arg) =>
        arg instanceof Error &&
        arg.message === 'Test error from MainPage for App.test'
    );

    expect(error).toBeDefined();
  });
});
