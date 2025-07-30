import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useLocalStorage from '@hooks/useLocalStorage';
import { usePaginationAndSearch } from '@hooks/usePaginationAndSearch';
import { usePokemonData } from '@hooks/usePokemonData';
import MainPage from '@pages/MainPage';

import { render, screen, waitFor } from '@/__tests__/utils/TestUtilities';

vi.mock('@hooks/usePokemonData', () => ({ usePokemonData: vi.fn() }));
vi.mock('@hooks/useLocalStorage', () => ({ default: vi.fn() }));
vi.mock('@components/Search', () => ({
  default: vi.fn(() => <div data-testid="search">Search</div>),
}));
vi.mock('@hooks/usePaginationAndSearch', () => ({
  usePaginationAndSearch: vi.fn(),
}));
vi.mock('@components/PokemonContent', () => ({
  PokemonContent: vi.fn(() => <div data-testid="pokemon-content">Content</div>),
}));

vi.mock('@pages/NotFoundPage', () => ({
  default: vi.fn(() => <div data-testid="not-found-page">Not Found</div>),
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

describe('MainPage - Validation', () => {
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

  describe('Page validation', () => {
    it('navigates to 404 when page is invalid', async () => {
      (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
        currentPage: 1,
        effectiveSearchTerm: '',
        handlePageChange: vi.fn(),
        handleSearch: vi.fn(),
        isValidPage: false,
      });

      renderWithRouter();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
      });
    });

    it('navigates to 404 when page exceeds total pages', async () => {
      (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
        currentPage: 5,
        effectiveSearchTerm: '',
        handlePageChange: vi.fn(),
        handleSearch: vi.fn(),
        isValidPage: true,
      });

      (usePokemonData as ReturnType<typeof vi.fn>).mockReturnValue({
        error: null,
        isLoading: false,
        pokemonItems: [],
        totalItems: 20, // 1 page only
      });

      renderWithRouter();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
      });
    });

    it('renders NotFoundPage when page is invalid', () => {
      (usePaginationAndSearch as ReturnType<typeof vi.fn>).mockReturnValue({
        currentPage: 1,
        effectiveSearchTerm: '',
        handlePageChange: vi.fn(),
        handleSearch: vi.fn(),
        isValidPage: false,
      });

      renderWithRouter();

      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Pokemon ID validation', () => {
    it.each([
      ['NaN', 'abc'],
      ['negative', '-1'],
      ['zero', '0'],
    ])('navigates to 404 for invalid pokemon ID: %s', async (_, detailsId) => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ detailsId });

      renderWithRouter();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
      });
    });

    it.each([
      ['NaN', 'abc'],
      ['negative', '-1'],
      ['zero', '0'],
    ])('renders NotFoundPage for invalid pokemon ID: %s', (_, detailsId) => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ detailsId });

      renderWithRouter();

      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('accepts valid pokemon ID', () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
        detailsId: '25',
      });

      renderWithRouter();

      expect(screen.getByTestId('search')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });
  });
});
