import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MainPage from '../../pages/MainPage/MainPage';

const localStorageMock = (function () {
  let store: { [key: string]: string | undefined } = {};
  return {
    getItem: vi.fn((key: string) =>
      store[key] === undefined ? null : (store[key] as string)
    ),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      store[key] = undefined;
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockFetch = vi.fn();
Object.defineProperty(window, 'fetch', { value: mockFetch });

const MOCK_POKEMON_LIST_RESPONSE = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
    { name: 'caterpie', url: 'https://pokeapi.co/api/v2/pokemon/10/' },
  ],
};

const MOCK_BULBASAUR_DETAIL_RESPONSE = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
};

const MOCK_CHARMANDER_DETAIL_RESPONSE = {
  id: 4,
  name: 'charmander',
  sprites: { front_default: 'https://example.com/charmander.png' },
};

const MOCK_SQUIRTLE_DETAIL_RESPONSE = {
  id: 7,
  name: 'squirtle',
  sprites: { front_default: 'https://example.com/squirtle.png' },
};

const MOCK_CATERPIE_DETAIL_RESPONSE = {
  id: 10,
  name: 'caterpie',
  sprites: { front_default: 'https://example.com/caterpie.png' },
};

describe('MainPage Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    mockFetch.mockReset();

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  const setupSuccessfulFetches = (
    listResponse = MOCK_POKEMON_LIST_RESPONSE
  ) => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(listResponse),
      status: 200,
    });

    listResponse.results.forEach((item) => {
      let detailResponse;
      switch (item.name) {
        case 'bulbasaur':
          detailResponse = MOCK_BULBASAUR_DETAIL_RESPONSE;
          break;
        case 'charmander':
          detailResponse = MOCK_CHARMANDER_DETAIL_RESPONSE;
          break;
        case 'squirtle':
          detailResponse = MOCK_SQUIRTLE_DETAIL_RESPONSE;
          break;
        case 'caterpie':
          detailResponse = MOCK_CATERPIE_DETAIL_RESPONSE;
          break;
        case 'missingno':
          detailResponse = {
            id: 0,
            name: 'missingno',
            sprites: { front_default: null },
          };
          break;
        default:
          detailResponse = {
            id: Math.random(),
            name: item.name,
            sprites: { front_default: null },
          };
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(detailResponse),
        status: 200,
      });
    });
  };

  it('retrieves saved search term from localStorage on initial load', async () => {
    localStorageMock.setItem('lastSearchTerm', 'Caterpie');
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                name: 'caterpie',
                url: 'https://pokeapi.co/api/v2/pokemon/10/',
              },
            ],
          }),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_CATERPIE_DETAIL_RESPONSE),
        status: 200,
      });

    render(<MainPage />);

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('lastSearchTerm');
    });

    expect(screen.getByPlaceholderText(/search for pokemons.../i)).toHaveValue(
      'Caterpie'
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/10/'
      );
    });
    expect(screen.getByText('caterpie')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('starts with an empty search term if no saved term exists in localStorage', async () => {
    setupSuccessfulFetches();

    render(<MainPage />);

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('lastSearchTerm');
    });

    expect(screen.getByPlaceholderText(/search for pokemons.../i)).toHaveValue(
      ''
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(5);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1/'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/4/'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/7/'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/10/'
      );
    });
  });

  it('saves new search term to localStorage when a search is performed', async () => {
    setupSuccessfulFetches();
    render(<MainPage />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(5);
    });
    mockFetch.mockClear();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_POKEMON_LIST_RESPONSE),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_CATERPIE_DETAIL_RESPONSE),
        status: 200,
      });

    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'Caterpie' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/10/'
      );
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'lastSearchTerm',
      'Caterpie'
    );
  });

  it('shows loading state while fetching data', async () => {
    mockFetch.mockReset();
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve({
            ok: true,
            json: () => new Promise(() => {}),
          });
        })
    );

    render(<MainPage />);

    expect(screen.getByText(/loading pokemon.../i)).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('renders correct number of items when data is provided and displays their names/images', async () => {
    setupSuccessfulFetches({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
        { name: 'caterpie', url: 'https://pokeapi.co/api/v2/pokemon/10/' },
      ],
    });

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading pokemon.../i)).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByAltText('bulbasaur')).toHaveAttribute(
      'src',
      MOCK_BULBASAUR_DETAIL_RESPONSE.sprites.front_default
    );

    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.getByAltText('charmander')).toHaveAttribute(
      'src',
      MOCK_CHARMANDER_DETAIL_RESPONSE.sprites.front_default
    );

    expect(screen.getByText('squirtle')).toBeInTheDocument();
    expect(screen.getByAltText('squirtle')).toHaveAttribute(
      'src',
      MOCK_SQUIRTLE_DETAIL_RESPONSE.sprites.front_default
    );

    expect(screen.getByText('caterpie')).toBeInTheDocument();
    expect(screen.getByAltText('caterpie')).toHaveAttribute(
      'src',
      MOCK_CATERPIE_DETAIL_RESPONSE.sprites.front_default
    );
  });

  it('displays "no results" message when data array is empty', async () => {
    setupSuccessfulFetches({ results: [] });

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading pokemon.../i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/no pokemon found\. try a different search!/i)
      ).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  it('displays error message when API call for list fails (e.g., 500 error)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Internal Server Error' }),
    });

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading pokemon.../i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/error: internal server error/i)
      ).toBeInTheDocument();
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('displays error message when API call for item details fails', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                name: 'bulbasaur',
                url: 'https://pokeapi.co/api/v2/pokemon/1/',
              },
              {
                name: 'caterpie',
                url: 'https://pokeapi.co/api/v2/pokemon/10/',
              },
            ],
          }),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Pokemon Not Found' }),
      });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_CATERPIE_DETAIL_RESPONSE),
      status: 200,
    });

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading pokemon.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/error: pokemon not found/i)).toBeInTheDocument();
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('makes API call with correct parameters based on search term', async () => {
    setupSuccessfulFetches();
    render(<MainPage />);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(5));
    mockFetch.mockClear();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_POKEMON_LIST_RESPONSE),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_CATERPIE_DETAIL_RESPONSE),
        status: 200,
      });

    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'Caterpie' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/10/'
      );
    });
    expect(screen.getByText('caterpie')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('displays item name and image correctly and handles missing image gracefully', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                name: 'caterpie',
                url: 'https://pokeapi.co/api/v2/pokemon/10/',
              },
              {
                name: 'missingno',
                url: 'https://pokeapi.co/api/v2/pokemon/0/',
              },
            ],
          }),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_CATERPIE_DETAIL_RESPONSE),
        status: 200,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 0,
            name: 'missingno',
            sprites: { front_default: null },
          }),
        status: 200,
      });

    render(<MainPage />);

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('caterpie')).toBeInTheDocument();
      expect(screen.getByAltText('caterpie')).toHaveAttribute(
        'src',
        MOCK_CATERPIE_DETAIL_RESPONSE.sprites.front_default
      );

      expect(screen.getByText('missingno')).toBeInTheDocument();
      expect(screen.queryByAltText('missingno')).not.toBeInTheDocument();
      const missingnoCard = screen.getByText('missingno').closest('li');
      expect(missingnoCard).not.toBeNull();
      expect(missingnoCard?.querySelector('img')).toBeNull();
    });
  });
});
