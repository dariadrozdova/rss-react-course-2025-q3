import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockPokeApiListResponse } from '@/__tests__/utils/mainPageMockData';
import {
  useGetPokemonDetailsQuery,
  useGetPokemonListQuery,
} from '@/api/pokemonApiSlice';
import { usePokemonData } from '@/hooks/usePokemonData';
import type { PokemonListItem } from '@/types/';

vi.mock('@/api/pokemonApiSlice', () => ({
  useGetPokemonDetailsQuery: vi.fn(),
  useGetPokemonListQuery: vi.fn(),
}));

const mockUseGetPokemonListQuery = useGetPokemonListQuery as ReturnType<
  typeof vi.fn
>;
const mockUseGetPokemonDetailsQuery = useGetPokemonDetailsQuery as ReturnType<
  typeof vi.fn
>;

const BATCH_LIMIT = 10_000;
const TEST_PAGE_SIZE = 2;
const TEST_LARGE_PAGE_SIZE = 10;
const FIRST_PAGE = 1;
const SECOND_PAGE = 2;

describe('usePokemonData', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  const mockPokemonListItems: PokemonListItem[] =
    mockPokeApiListResponse.results;

  const mockApiResponse = {
    results: mockPokemonListItems.map((item, index) => ({
      id: index + 1,
      imageUrl: undefined,
      name: item.name,
      url: item.url,
    })),
    total: mockPokemonListItems.length,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockApiResponse,
      error: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      isSuccess: true,
      refetch: vi.fn(),
    });

    mockUseGetPokemonDetailsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      isSuccess: true,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('should load all Pokemon on initial render', async () => {
    const { result } = renderHook(() =>
      usePokemonData('', FIRST_PAGE, TEST_PAGE_SIZE)
    );

    expect(mockUseGetPokemonListQuery).toHaveBeenCalledWith({
      limit: BATCH_LIMIT,
      offset: 0,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemonItems).toHaveLength(TEST_PAGE_SIZE);
    expect(result.current.totalItems).toBe(mockPokemonListItems.length);
    expect(result.current.error).toBeNull();
  });

  it('should filter Pokemon by search term', async () => {
    const { result } = renderHook(() =>
      usePokemonData('char', FIRST_PAGE, TEST_PAGE_SIZE)
    );

    expect(result.current.isLoading).toBe(false);

    const charmanderExists = mockPokemonListItems.some((pokemon) =>
      pokemon.name.toLowerCase().includes('char')
    );

    if (charmanderExists) {
      expect(result.current.pokemonItems.length).toBeGreaterThan(0);
      expect(result.current.pokemonItems[0].name).toContain('char');
    } else {
      expect(result.current.pokemonItems).toHaveLength(0);
    }
  });

  it('should handle pagination correctly', async () => {
    const { rerender, result } = renderHook(
      ({ limit, page, searchTerm }) => usePokemonData(searchTerm, page, limit),
      {
        initialProps: {
          limit: TEST_PAGE_SIZE,
          page: FIRST_PAGE,
          searchTerm: '',
        },
      }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemonItems).toHaveLength(TEST_PAGE_SIZE);

    rerender({ limit: TEST_PAGE_SIZE, page: SECOND_PAGE, searchTerm: '' });

    expect(result.current.isLoading).toBe(false);

    const remainingItems = mockPokemonListItems.length - TEST_PAGE_SIZE;
    const expectedSecondPageLength = Math.min(remainingItems, TEST_PAGE_SIZE);

    expect(result.current.pokemonItems).toHaveLength(expectedSecondPageLength);
    expect(result.current.totalItems).toBe(mockPokemonListItems.length);
  });

  it('should handle empty search results', async () => {
    const { result } = renderHook(() =>
      usePokemonData('nonexistentpokemon', FIRST_PAGE, TEST_LARGE_PAGE_SIZE)
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemonItems).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should set error state if useGetPokemonListQuery fails', async () => {
    const errorMessage = 'API is down';

    mockUseGetPokemonListQuery.mockReturnValue({
      data: undefined,
      error: { message: errorMessage },
      isError: true,
      isFetching: false,
      isLoading: false,
      isSuccess: false,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() =>
      usePokemonData('', FIRST_PAGE, TEST_LARGE_PAGE_SIZE)
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemonItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.error).toBe('Failed to fetch Pokemon list.');
  });

  it('should handle loading state', async () => {
    mockUseGetPokemonListQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isError: false,
      isFetching: true,
      isLoading: true,
      isSuccess: false,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() =>
      usePokemonData('', FIRST_PAGE, TEST_LARGE_PAGE_SIZE)
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemonItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should update when search term changes', async () => {
    const { rerender, result } = renderHook(
      ({ searchTerm }) =>
        usePokemonData(searchTerm, FIRST_PAGE, TEST_LARGE_PAGE_SIZE),
      { initialProps: { searchTerm: '' } }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.totalItems).toBe(mockPokemonListItems.length);
    expect(result.current.pokemonItems.length).toBeGreaterThan(0);

    const searchTerm = mockPokemonListItems[0].name.slice(0, 3);
    rerender({ searchTerm });

    expect(result.current.isLoading).toBe(false);

    const expectedFilteredCount = mockPokemonListItems.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;

    expect(result.current.totalItems).toBe(expectedFilteredCount);

    if (expectedFilteredCount > 0) {
      expect(result.current.pokemonItems.length).toBeGreaterThan(0);
      expect(result.current.pokemonItems[0].name.toLowerCase()).toContain(
        searchTerm.toLowerCase()
      );
    }
  });
});
