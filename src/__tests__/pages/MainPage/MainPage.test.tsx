import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MainPage from '../../../pages/MainPage/MainPage';
import type { PokemonItem } from '../../../types/types';
import {
  mockPokeApiListResponse,
  mockPokemonDetailResponses,
} from '../../utils/mainPageMockData';

const mockFetch = vi.fn();

const localStorageMock = (() => {
  const store = new Map<string, string>();
  return {
    clear: vi.fn(() => {
      store.clear();
    }),
    getItem: vi.fn((key: string) => store.get(key) || null),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('../../../components/Search/Search', () => ({
  default: vi.fn(({ initialSearchTerm, onSearch }) => (
    <input
      data-testid="search-input"
      onChange={() => {}}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch(e.currentTarget.value);
        }
      }}
      value={initialSearchTerm}
    />
  )),
}));

vi.mock('../../../components/CardList/CardList', () => ({
  default: vi.fn(({ pokemonItems }) => (
    <ul data-testid="card-list">
      {pokemonItems.map((item: PokemonItem) => (
        <li data-testid={`card-item-${item.id}`} key={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  )),
}));

vi.mock('../../../components/Loader/Loader', () => {
  const MockLoader = vi.fn(() => <div data-testid="loader">Loading...</div>);
  return {
    default: MockLoader,
  };
});

describe('MainPage', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorageMock.clear();
    mockFetch.mockClear();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  const setupSuccessfulFetchMocks = (
    listResponse = mockPokeApiListResponse,
    detailResponses = mockPokemonDetailResponses
  ) => {
    mockFetch.mockImplementation(async (url: RequestInfo | URL) => {
      const urlString = url.toString();
      if (urlString.includes('limit=20')) {
        return {
          json: () => Promise.resolve(listResponse),
          ok: true,
        } as Response;
      } else if (urlString.includes('/pokemon/')) {
        const nameMatch = /\/pokemon\/([^/]+)\/?$/.exec(urlString);
        if (nameMatch && detailResponses[nameMatch[1]]) {
          return {
            json: () => Promise.resolve(detailResponses[nameMatch[1]]),
            ok: true,
          } as Response;
        }
      }
      throw new Error(`Unhandled fetch URL: ${urlString}`);
    });
  };

  it('fetches Pokemon on initial render and displays them, saving empty search to localStorage', async () => {
    setupSuccessfulFetchMocks();

    render(<MainPage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(
      1 + mockPokeApiListResponse.results.length
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
    );

    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.getByText('squirtle')).toBeInTheDocument();

    expect(localStorageMock.setItem).toHaveBeenCalledWith('lastSearchTerm', '');
  });

  it('fetches Pokemon using search term from localStorage on initial render', async () => {
    localStorageMock.setItem('lastSearchTerm', 'bulba');

    setupSuccessfulFetchMocks();

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('charmander')).not.toBeInTheDocument();
    expect(screen.queryByText('squirtle')).not.toBeInTheDocument();

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'lastSearchTerm',
      'bulba'
    );
  });

  it('displays an error message when the initial list fetch fails', async () => {
    const singleItemResponse = {
      results: [
        {
          name: 'testpokemon',
          url: 'https://pokeapi.co/api/v2/pokemon/testpokemon/',
        },
      ],
    };

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(singleItemResponse),
        ok: true,
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: 'Internal Server Error' }),
        ok: false,
        status: 500,
      } as Response)
    );

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('Error: Internal Server Error')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon:',
      expect.any(Error)
    );
    expect((consoleWarnSpy.mock.calls[0][1] as Error).message).toBe(
      'Internal Server Error'
    );

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('displays an error message when a detail fetch fails', async () => {
    const singleItemResponse = {
      results: [
        {
          name: 'testpokemon',
          url: 'https://pokeapi.co/api/v2/pokemon/testpokemon/',
        },
      ],
    };

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(singleItemResponse),
        ok: true,
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ message: 'Test Pokemon details not found' }),
        ok: false,
        status: 404,
      } as Response)
    );

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('Error: Test Pokemon details not found')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon:',
      expect.any(Error)
    );
    expect((consoleWarnSpy.mock.calls[0][1] as Error).message).toBe(
      'Test Pokemon details not found'
    );

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('displays "No Pokemon found" message when search yields no results', async () => {
    const emptyResultsList = { results: [] };
    setupSuccessfulFetchMocks(emptyResultsList);

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText('No Pokemon found. Try a different search!')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();

    expect(localStorageMock.setItem).toHaveBeenCalledWith('lastSearchTerm', '');
  });

  it('throws an error when "Throw Test Error" button is clicked', async () => {
    setupSuccessfulFetchMocks();
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const errorButton = screen.getByRole('button', {
      name: /throw test error/i,
    });

    consoleWarnSpy.mockClear();

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow('This is a test error thrown from the render method!');
  });
});
