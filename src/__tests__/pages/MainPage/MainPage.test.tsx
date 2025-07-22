import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useLocalStorage from '../../../hooks/useLocalStorage';
import { usePokemonData } from '../../../hooks/usePokemonData';
import MainPage from '../../../pages/MainPage/MainPage';
import type { PokemonItem } from '../../../types/types';

vi.mock('../../../hooks/usePokemonData', () => ({
  usePokemonData: vi.fn(),
}));

vi.mock('../../../hooks/useLocalStorage', () => ({
  default: vi.fn(),
}));

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
      defaultValue={initialSearchTerm}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch(e.currentTarget.value);
        }
      }}
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

vi.mock('../../../components/Loader/Loader', () => ({
  default: vi.fn(() => <div data-testid="loader">Loading...</div>),
}));

describe('MainPage', () => {
  let mockFetchData: ReturnType<typeof vi.fn>;
  let mockSetSearchTerm: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSetSearchTerm = vi.fn();
    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      '',
      mockSetSearchTerm,
    ]);

    mockFetchData = vi.fn(() => Promise.resolve());

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      fetchData: mockFetchData,
      isLoading: false,
      pokemonItems: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays loader when data is loading', () => {
    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      fetchData: mockFetchData,
      isLoading: true,
      pokemonItems: [],
    });

    render(<MainPage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
  });

  it('displays Pokemon items when data is loaded successfully', async () => {
    const mockPokemonItems: PokemonItem[] = [
      { id: 1, imageUrl: 'url1', name: 'bulbasaur', url: 'url1' },
      { id: 2, imageUrl: 'url2', name: 'charmander', url: 'url2' },
    ];
    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      fetchData: mockFetchData,
      isLoading: false,
      pokemonItems: mockPokemonItems,
    });

    render(<MainPage />);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
  });

  it('displays an error message when data fetching fails', () => {
    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: 'Failed to load Pokemon',
      fetchData: mockFetchData,
      isLoading: false,
      pokemonItems: [],
    });

    render(<MainPage />);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(
      screen.getByText('Error: Failed to load Pokemon')
    ).toBeInTheDocument();
  });

  it('displays "No Pokemon found" message when search yields no results', () => {
    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      fetchData: mockFetchData,
      isLoading: false,
      pokemonItems: [],
    });

    render(<MainPage />);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(
      screen.getByText('No Pokemon found. Try a different search!')
    ).toBeInTheDocument();
  });

  it('calls fetchData with the correct term when search input changes and Enter is pressed', async () => {
    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      'initialTerm',
      mockSetSearchTerm,
    ]);

    render(<MainPage />);

    const searchInput = screen.getByTestId('search-input');

    searchInput.value = 'pikachu';
    fireEvent.change(searchInput);
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('pikachu');
  });

  it('loads search term from localStorage on initial render via useLocalStorage', async () => {
    localStorage.setItem('lastSearchTerm', 'charizard');

    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      'charizard',
      mockSetSearchTerm,
    ]);

    render(<MainPage />);

    expect(usePokemonData).toHaveBeenCalledWith('charizard');

    expect(screen.getByTestId('search-input')).toHaveValue('charizard');
  });

  it('throws an error when "Throw Test Error" button is clicked', async () => {
    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      fetchData: mockFetchData,
      isLoading: false,
      pokemonItems: [],
    });

    render(<MainPage />);

    const errorButton = screen.getByRole('button', {
      name: /throw test error/i,
    });

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow('This is a test error thrown from the render method!');
  });
});
