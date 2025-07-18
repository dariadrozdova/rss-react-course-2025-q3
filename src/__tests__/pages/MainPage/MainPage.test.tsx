import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    getItem: vi.fn((key: string) => store.get(key) || null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('../../../components/Search/Search', () => ({
  default: vi.fn(({ initialSearchTerm, onSearch }) => (
    <input
      data-testid="search-input"
      value={initialSearchTerm}
      onChange={() => {}}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSearch(e.currentTarget.value);
      }}
    />
  )),
}));

vi.mock('../../../components/CardList/CardList', () => ({
  default: vi.fn(({ pokemonItems }) => (
    <ul data-testid="card-list">
      {pokemonItems.map((item: PokemonItem) => (
        <li key={item.id} data-testid={`card-item-${item.id}`}>
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
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.clear();
    mockFetch.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  const setupSuccessfulFetchMocks = (
    listResponse = mockPokeApiListResponse,
    detailResponses = mockPokemonDetailResponses
  ) => {
    mockFetch.mockImplementation(async (url: RequestInfo | URL) => {
      const urlString = url.toString();
      if (urlString.includes('limit=20')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(listResponse),
        } as Response);
      } else if (urlString.includes('/pokemon/')) {
        const nameMatch = urlString.match(/\/pokemon\/([^/]+)\/?$/);
        if (
          nameMatch &&
          detailResponses[nameMatch[1] as keyof typeof detailResponses]
        ) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve(
                detailResponses[nameMatch[1] as keyof typeof detailResponses]
              ),
          } as Response);
        }
      }
      return Promise.reject(new Error(`Unhandled fetch URL: ${urlString}`));
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
        ok: true,
        json: () => Promise.resolve(singleItemResponse),
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error' }),
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

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon:',
      expect.any(Error)
    );
    expect((consoleErrorSpy.mock.calls[0][1] as Error).message).toBe(
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
        ok: true,
        json: () => Promise.resolve(singleItemResponse),
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({ message: 'Test Pokemon details not found' }), // Explicit error message
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

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon:',
      expect.any(Error)
    );
    expect((consoleErrorSpy.mock.calls[0][1] as Error).message).toBe(
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

    consoleErrorSpy.mockClear();

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow('This is a test error thrown from the render method!');
  });
});
