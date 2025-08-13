import { act } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '@/App';
import MainPage from '@/pages/MainPage';
import { store } from '@/store/index';
import { unselectAllItems } from '@/store/slices/selectedItemsSlice';

vi.mock('@/components/ErrorBoundary', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/components/ErrorBoundary')>();
  return { default: actual.default };
});

vi.mock('@/pages/MainPage', async () => {
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

  return { default: MockMainPage };
});

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let localStorageMock: Record<string, ReturnType<typeof vi.fn>>;

const renderApp = (
  initialEntries = ['/'],
  customRoutes?: React.ReactElement[]
) => {
  const defaultRoutes = <Route element={<MainPage />} index />;

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<App />} path="/">
          {customRoutes || defaultRoutes}
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('App', () => {
  beforeEach(() => {
    const storeMap = new Map<string, string>();
    localStorageMock = {
      clear: vi.fn(() => {
        storeMap.clear();
      }),
      getItem: vi.fn((key: string) => storeMap.get(key) || null),
      removeItem: vi.fn((key: string) => storeMap.delete(key)),
      setItem: vi.fn((key: string, value: string) => storeMap.set(key, value)),
    };

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    store.dispatch(unselectAllItems());
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('renders MainPage component inside ErrorBoundary', async () => {
    renderApp();
    expect(await screen.findByTestId('main-page')).toBeInTheDocument();
    expect(await screen.findByText('MainPage Content')).toBeInTheDocument();
  });

  it('displays ErrorBoundary fallback when MainPage throws an error', async () => {
    renderApp();

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

    const calls = consoleErrorSpy.mock.calls.flat();
    const error = calls.find(
      (argument) =>
        argument instanceof Error &&
        argument.message === 'Test error from MainPage for App.test'
    );
    expect(error).toBeDefined();
  });

  it('initializes Redux store from localStorage if items are present', async () => {
    const mockPokemonItem = {
      id: 1,
      imageUrl: 'url',
      name: 'bulbasaur',
      url: 'url',
    };
    localStorageMock.setItem(
      'pokemonSelectedItems',
      JSON.stringify([mockPokemonItem])
    );

    renderApp();

    await waitFor(() => {
      expect(store.getState().selectedItems.items).toEqual([mockPokemonItem]);
    });
    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      'pokemonSelectedItems'
    );
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
    'Navigation for $path',
    ({ content, expectedHref, linkName, path, testId }) => {
      beforeEach(() => {
        const routes =
          path === '/' ? (
            <Route element={<MainPage />} index />
          ) : (
            <Route
              element={<div data-testid={testId}>{content}</div>}
              path="about"
            />
          );

        renderApp([path], [routes]);
      });

      it('renders navigation link with correct route', async () => {
        const link = await screen.findByRole('link', { name: linkName });
        expect(link).toHaveAttribute('href', expectedHref);
      });

      it('renders correct content for route', async () => {
        expect(await screen.findByTestId(testId)).toBeInTheDocument();
        expect(await screen.findByText(content)).toBeInTheDocument();
      });
    }
  );

  it('NavLink className functions execute for both Home and About links', async () => {
    renderApp();

    const homeLink = await screen.findByRole('link', { name: /home/i });
    const aboutLink = await screen.findByRole('link', { name: /about/i });

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });
});
