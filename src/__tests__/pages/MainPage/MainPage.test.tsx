import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { PokemonItem } from '@types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useLocalStorage from '@hooks/useLocalStorage';
import { usePaginationAndSearch } from '@hooks/usePaginationAndSearch';
import { usePokemonData } from '@hooks/usePokemonData';
import MainPage from '@pages/MainPage';

import { fireEvent, render, screen } from '@/__tests__/utils/TestUtilities';

vi.mock('@hooks/usePokemonData', () => ({ usePokemonData: vi.fn() }));
vi.mock('@hooks/useLocalStorage', () => ({ default: vi.fn() }));
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
      onPokemonClick,
      pokemonItems,
      selectedPokemonId,
      totalPages,
    }: {
      currentPage: number;
      effectiveSearchTerm: string;
      error: null | string;
      isLoading: boolean;
      onPageChange: (page: number) => void;
      onPokemonClick?: (id: number) => void;
      pokemonItems: PokemonItem[];
      selectedPokemonId?: number;
      totalPages: number;
    }) => {
      return (
        <>
          {isLoading && <div data-testid="loader">Loading...</div>}
          {error && <div data-testid="error-message">Error: {error}</div>}
          {!isLoading &&
            !error &&
            pokemonItems.length === 0 &&
            effectiveSearchTerm && (
              <div data-testid="no-results-message">
                No Pokemon found for "{effectiveSearchTerm}"
              </div>
            )}
          {pokemonItems.length > 0 && (
            <ul data-testid="card-list">
              {pokemonItems.map((item) => (
                <li
                  className={selectedPokemonId === item.id ? 'selected' : ''}
                  data-testid={`card-item-${item.id}`}
                  key={item.id}
                  onClick={() => onPokemonClick?.(item.id)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet</div>),
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

const ITEMS_PER_PAGE = 20;

describe('MainPage - Basic Functionality', () => {
  let mockSetSearchTerm: ReturnType<typeof vi.fn>;
  let mockHandleSearch: ReturnType<typeof vi.fn>;
  let mockHandlePageChange: ReturnType<typeof vi.fn>;
  let mockNavigate: ReturnType<typeof vi.fn>;

  const renderWithRouter = () => render(<MainPage />);

  beforeEach(() => {
    vi.clearAllMocks();

    mockSetSearchTerm = vi.fn();
    mockHandleSearch = vi.fn();
    mockHandlePageChange = vi.fn();
    mockNavigate = vi.fn();

    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({});
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
      pathname: '/',
      search: '',
    });

    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      '',
      mockSetSearchTerm,
    ]);

    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 1,
      effectiveSearchTerm: '',
      handlePageChange: mockHandlePageChange,
      handleSearch: mockHandleSearch,
      isValidPage: true,
    });

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: [],
      totalItems: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Search and PokemonContent components', () => {
    renderWithRouter();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-mock')).toBeInTheDocument();
  });

  it('passes correct props to usePokemonData hook', () => {
    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 2,
      effectiveSearchTerm: 'charmander',
      handlePageChange: mockHandlePageChange,
      handleSearch: mockHandleSearch,
      isValidPage: true,
    });

    renderWithRouter();

    expect(usePokemonData).toHaveBeenCalledWith(
      'charmander',
      2,
      ITEMS_PER_PAGE
    );
  });

  it('calls handleSearch when search input changes and Enter is pressed', () => {
    renderWithRouter();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockHandleSearch).toHaveBeenCalledWith('pikachu');
  });

  it('loads search term from localStorage on initial render', () => {
    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      'charizard',
      mockSetSearchTerm,
    ]);
    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 1,
      effectiveSearchTerm: 'charizard',
      handlePageChange: mockHandlePageChange,
      handleSearch: mockHandleSearch,
      isValidPage: true,
    });

    renderWithRouter();

    expect(screen.getByTestId('search-input')).toHaveValue('charizard');
  });

  it('displays error message when data fetch fails', () => {
    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: 'Failed to fetch Pokemon data',
      isLoading: false,
      pokemonItems: [],
      totalItems: 0,
    });

    renderWithRouter();

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Error: Failed to fetch Pokemon data'
    );
  });

  it('displays no results message when search yields no results', () => {
    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 1,
      effectiveSearchTerm: 'nonexistentpokemon',
      handlePageChange: mockHandlePageChange,
      handleSearch: mockHandleSearch,
      isValidPage: true,
    });

    renderWithRouter();

    expect(screen.getByTestId('no-results-message')).toHaveTextContent(
      'No Pokemon found for "nonexistentpokemon"'
    );
  });
});
