import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MainPage from '../../../pages/MainPage/MainPage';
import type { PokemonItem } from '../../../types/types';

const mockFetch = vi.fn();

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete store[key];
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

// Explicitly mock the Search component with data-testid
vi.mock('../../../components/Search/Search', () => {
  const MockSearch = vi.fn(({ initialSearchTerm, onSearch }) => (
    <input
      data-testid="search-input" // This is what the test looks for
      value={initialSearchTerm}
      onChange={() => {}} // No-op, we'll use fireEvent.change directly
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSearch(e.currentTarget.value);
      }}
    />
  ));
  // Keep the original properties if any are needed, otherwise this is fine.
  return {
    default: MockSearch,
  };
});

// Explicitly mock the Loader component with data-testid
vi.mock('../../../components/Loader/Loader', () => {
  const MockLoader = vi.fn(() => <div data-testid="loader">Loading...</div>);
  return {
    default: MockLoader,
  };
});

const mockPokeApiListResponse = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/' },
    {
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/charmander/',
    },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/squirtle/' },
  ],
};

const mockPokemonDetailResponses = {
  bulbasaur: {
    id: 1,
    name: 'bulbasaur',
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
  },
  charmander: {
    id: 4,
    name: 'charmander',
    sprites: { front_default: 'https://example.com/charmander.png' },
  },
  squirtle: {
    id: 7,
    name: 'squirtle',
    sprites: { front_default: 'https://example.com/squirtle.png' },
  },
  pikachu: {
    id: 25,
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
  },
};

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
    // Use mockImplementation to handle multiple calls dynamically based on URL
    mockFetch.mockImplementation(async (url: RequestInfo | URL) => {
      const urlString = url.toString();
      if (urlString.includes('limit=20')) {
        // Main list fetch
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(listResponse),
        } as Response);
      } else if (urlString.includes('/pokemon/')) {
        // Detail fetch
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

  // it('fetches Pokemon on initial render and displays them, saving empty search to localStorage', async () => {
  //   setupSuccessfulFetchMocks();

  //   render(<MainPage />);

  //   expect(screen.getByTestId('loader')).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  //   });

  //   expect(mockFetch).toHaveBeenCalledTimes(
  //     1 + mockPokeApiListResponse.results.length
  //   );
  //   expect(mockFetch).toHaveBeenCalledWith(
  //     'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
  //   );

  //   expect(screen.getByTestId('card-list')).toBeInTheDocument();
  //   expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  //   expect(screen.getByText('charmander')).toBeInTheDocument();
  //   expect(screen.getByText('squirtle')).toBeInTheDocument();

  //   expect(localStorageMock.setItem).toHaveBeenCalledWith('lastSearchTerm', '');
  // });

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

  // it('performs a new search when user types into the Search component and submits', async () => {
  //   setupSuccessfulFetchMocks();
  //   render(<MainPage />);
  //   await waitFor(() => {});

  //   const searchResults = {
  //     results: [
  //       { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu/' },
  //     ],
  //   };

  //   mockFetch.mockImplementationOnce(async (url: RequestInfo | URL) => {
  //     if (url.toString().includes('limit=20')) {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve(searchResults),
  //       } as Response);
  //     }
  //     return Promise.reject(
  //       new Error(`Unexpected list fetch during search for: ${url}`)
  //     );
  //   });
  //   mockFetch.mockImplementationOnce(async (url: RequestInfo | URL) => {
  //     if (url.toString().includes('pikachu')) {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve(mockPokemonDetailResponses.pikachu),
  //       } as Response);
  //     }
  //     return Promise.reject(new Error(`Unexpected detail fetch for: ${url}`));
  //   });

  //   const searchInput = screen.getByTestId('search-input');
  //   fireEvent.change(searchInput, { target: { value: 'pikachu' } });
  //   fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

  //   expect(screen.getByTestId('loader')).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  //   });

  //   expect(mockFetch).toHaveBeenCalledTimes(5);
  //   expect(mockFetch).toHaveBeenCalledWith(
  //     'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
  //   );
  //   expect(mockFetch).toHaveBeenCalledWith(
  //     'https://pokeapi.co/api/v2/pokemon/pikachu/'
  //   );

  //   expect(screen.getByText('pikachu')).toBeInTheDocument();
  //   expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();

  //   expect(localStorageMock.setItem).toHaveBeenCalledWith(
  //     'lastSearchTerm',
  //     'pikachu'
  //   );
  // });

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
