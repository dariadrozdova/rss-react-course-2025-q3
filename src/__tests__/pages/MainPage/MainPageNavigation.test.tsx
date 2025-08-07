import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { PokemonItem } from '@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
      onPokemonClick,
      pokemonItems,
      selectedPokemonId,
    }: {
      onPokemonClick?: (id: number) => void;
      pokemonItems: PokemonItem[];
      selectedPokemonId?: number;
    }) => (
      <div data-testid="pokemon-content">
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
      </div>
    )
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

describe('MainPage - Navigation', () => {
  let mockNavigate: ReturnType<typeof vi.fn>;

  const renderWithRouter = () => render(<MainPage />);

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate = vi.fn();

    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({});
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
      pathname: '/',
      search: '',
    });

    (useLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue([
      '',
      vi.fn(),
    ]);

    (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
      currentPage: 1,
      effectiveSearchTerm: '',
      handlePageChange: vi.fn(),
      handleSearch: vi.fn(),
      isValidPage: true,
    });

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: [],
      totalItems: 0,
    });
  });

  it('navigates to details page when pokemon is clicked', () => {
    const mockPokemon = [
      { id: 1, imageUrl: 'test.jpg', name: 'bulbasaur', url: 'test-url' },
    ];

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: mockPokemon,
      totalItems: 1,
    });

    renderWithRouter();

    fireEvent.click(screen.getByTestId('card-item-1'));

    expect(mockNavigate).toHaveBeenCalledWith('/details/1?');
  });

  it('preserves search parameters when navigating to details', () => {
    (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({
      pathname: '/',
      search: '?page=2&search=pikachu',
    });

    const mockPokemon = [
      { id: 25, imageUrl: 'test.jpg', name: 'pikachu', url: 'test-url' },
    ];

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: mockPokemon,
      totalItems: 1,
    });

    renderWithRouter();

    fireEvent.click(screen.getByTestId('card-item-25'));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/details/25?page=2&search=pikachu'
    );
  });

  it('renders Outlet when detailsId is present', () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ detailsId: '1' });

    renderWithRouter();

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('does not render Outlet when detailsId is absent', () => {
    renderWithRouter();

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });

  it('passes selectedPokemonId when detailsId is present', () => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      detailsId: '25',
    });

    const mockPokemon = [
      { id: 25, imageUrl: 'test.jpg', name: 'pikachu', url: 'test-url' },
    ];

    (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
      error: null,
      isLoading: false,
      pokemonItems: mockPokemon,
      totalItems: 1,
    });

    renderWithRouter();

    expect(screen.getByTestId('card-item-25')).toHaveClass('selected');
  });
});
