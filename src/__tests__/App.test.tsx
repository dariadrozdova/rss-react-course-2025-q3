import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../App';
import MainPage from '../pages/MainPage';

vi.mock('@components/ErrorBoundary', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@components/ErrorBoundary')>();
  return {
    default: actual.default,
  };
});

vi.mock('@pages/MainPage', async () => {
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
          onClick={() => {
            setShouldThrow(true);
          }}
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
          <Route element={<App />} path="/">
            <Route element={<MainPage />} index />
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
          <Route element={<App />} path="/">
            <Route element={<MainPage />} index />
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
      (argument) =>
        argument instanceof Error &&
        argument.message === 'Test error from MainPage for App.test'
    );

    expect(error).toBeDefined();
  });

  describe.each([
    {
      content: 'MainPage Content',
      expectedHref: '/',
      linkName: /home/i,
      path: '/',
      testId: 'main-page',
    },
    {
      content: 'About Content',
      expectedHref: '/about',
      linkName: /about/i,
      path: '/about',
      testId: 'about-page',
    },
  ])(
    'Navigation functionality for $path',
    ({ content, expectedHref, linkName, path, testId }) => {
      beforeEach(async () => {
        const routeElement =
          path === '/' ? (
            <MainPage />
          ) : (
            <div data-testid={testId}>{content}</div>
          );

        render(
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route element={<App />} path="/">
                <Route
                  element={routeElement}
                  {...(path === '/' ? { index: true } : { path: 'about' })}
                />
              </Route>
            </Routes>
          </MemoryRouter>
        );
      });

      it('renders navigation link with correct route', async () => {
        const link = await screen.findByRole('link', { name: linkName });
        expect(link).toHaveAttribute('href', expectedHref);
      });

      it('renders correct content for route', async () => {
        if (path === '/') {
          expect(await screen.findByTestId('main-page')).toBeInTheDocument();
          expect(
            await screen.findByText('MainPage Content')
          ).toBeInTheDocument();
        } else {
          expect(await screen.findByTestId(testId)).toBeInTheDocument();
          expect(await screen.findByText(content)).toBeInTheDocument();
        }
      });
    }
  );

  describe('NavLink className function execution', () => {
    beforeEach(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<App />} path="/">
              <Route element={<MainPage />} index />
            </Route>
          </Routes>
        </MemoryRouter>
      );
    });

    it.each([
      { description: 'Home', linkName: /home/i },
      { description: 'About', linkName: /about/i },
    ])(
      '$description NavLink className function executes both branches',
      async ({ linkName }) => {
        const link = await screen.findByRole('link', { name: linkName });
        expect(link).toBeInTheDocument();
      }
    );
  });
});
