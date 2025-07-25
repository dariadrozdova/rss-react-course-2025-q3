import { fireEvent, render, screen } from '@testing-library/react';
import type { PokemonItem } from '@types';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PokemonContent as MockPokemonContent } from '@components/PokemonContent';
import useLocalStorage from '@hooks/useLocalStorage';
import { usePaginationAndSearch } from '@hooks/usePaginationAndSearch';
import { usePokemonData } from '@hooks/usePokemonData';
import MainPage from '@pages/MainPage';

const ITEMS_PER_PAGE = 20;

vi.mock('@hooks/usePokemonData', () => ({ usePokemonData: vi.fn() }));
vi.mock('@hooks/useLocalStorage', () => ({ default: vi.fn() }));

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

vi.mock('@components/Search', () => ({
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

vi.mock('@hooks/usePaginationAndSearch', () => ({
  usePaginationAndSearch: vi.fn(),
}));

vi.mock('@components/PokemonContent', () => ({
  PokemonContent: vi.fn(
    ({
      currentPage,
      effectiveSearchTerm,
      error,
      isLoading,
      onPageChange,
      pokemonItems,
      totalPages,
    }: {
      currentPage: number;
      effectiveSearchTerm: string;
      error: null | string;
      isLoading: boolean;
      onPageChange: (page: number) => void;
      pokemonItems: PokemonItem[];
      totalPages: number;
    }) => {
      if (isLoading) {
        return <div data-testid="loader">Loading...</div>;
      }
      if (error) {
        return <div data-testid="error-message">Error: {error}</div>;
      }
      if (pokemonItems.length === 0 && effectiveSearchTerm) {
        return (
          <div data-testid="no-results-message">
            No Pokemon found for "{effectiveSearchTerm}". Try a different
            search!
          </div>
        );
      }

      return (
        <>
          <ul data-testid="card-list">
            {pokemonItems.map((item: PokemonItem) => (
              <li data-testid={`card-item-${item.id}`} key={item.id}>
                {item.name}
              </li>
            ))}
          </ul>
          <div data-testid="pagination-mock">
            Page {currentPage} of {totalPages}
            <button
              onClick={() => {
                onPageChange(currentPage + 1);
              }}
            >
              Next
            </button>
          </div>
        </>
      );
    }
  ),
}));

describe('MainPage', () => {
  let mockSetSearchTerm: ReturnType<typeof vi.fn>;
  let mockUsePaginationAndSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSetSearchTerm = vi.fn();
    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      '',
      mockSetSearchTerm,
    ]);

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: [],
      totalItems: 0,
    });

    mockUsePaginationAndSearch = vi.fn(() => ({
      currentPage: 1,
      effectiveSearchTerm: '',
      handlePageChange: vi.fn(),
      handleSearch: vi.fn(),
    }));
    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockImplementation(
      mockUsePaginationAndSearch
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  it('renders Search and PokemonContent components', () => {
    renderWithRouter(<MainPage />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(MockPokemonContent).toHaveBeenCalled();
  });

  it('passes correct props to usePokemonData hook', () => {
    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 2,
      effectiveSearchTerm: 'charmander',
      handlePageChange: vi.fn(),
      handleSearch: vi.fn(),
    });

    renderWithRouter(<MainPage />);
    expect(usePokemonData).toHaveBeenCalledWith(
      'charmander',
      2,
      ITEMS_PER_PAGE
    );
  });

  it('calls handleSearch with the correct term when search input changes and Enter is pressed', async () => {
    const mockHandleSearch = vi.fn();
    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 1,
      effectiveSearchTerm: '',
      handlePageChange: vi.fn(),
      handleSearch: mockHandleSearch,
    });

    renderWithRouter(<MainPage />);

    const searchInput = screen.getByTestId('search-input');

    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = 'pikachu';
      fireEvent.change(searchInput);
      fireEvent.keyDown(searchInput, { key: 'Enter' });
    } else {
      console.warn('searchInput is not an HTMLInputElement');
    }

    expect(mockHandleSearch).toHaveBeenCalledWith('pikachu');
  });

  it('loads search term from localStorage on initial render via useLocalStorage', async () => {
    localStorage.setItem('lastSearchTerm', 'charizard');

    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      'charizard',
      mockSetSearchTerm,
    ]);

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: [],
      totalItems: 0,
    });

    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 1,
      effectiveSearchTerm: 'charizard',
      handlePageChange: vi.fn(),
      handleSearch: vi.fn(),
    });

    renderWithRouter(<MainPage />);

    expect(usePokemonData).toHaveBeenCalledWith(
      'charizard',
      expect.any(Number),
      expect.any(Number)
    );

    expect(screen.getByTestId('search-input')).toHaveValue('charizard');
  });
});
