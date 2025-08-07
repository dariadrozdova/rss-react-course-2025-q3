import { renderHook, waitFor } from '@testing-library/react';
import type { PokemonItem, PokemonListItem } from '@types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPokemonDetails, fetchPokemonList } from '@api/pokemonApi';
import { usePokemonData } from '@hooks/usePokemonData';

import {
  mockPokeApiListResponse,
  mockPokemonDetailResponses,
} from '@/__tests__/utils/mainPageMockData';

vi.mock('@api/pokemonApi', () => ({
  fetchPokemonDetails: vi.fn(),
  fetchPokemonList: vi.fn(),
}));

const mockFetchPokemonList = fetchPokemonList as ReturnType<typeof vi.fn>;
const mockFetchPokemonDetails = fetchPokemonDetails as ReturnType<typeof vi.fn>;

const BATCH_LIMIT = 1000;
const TEST_PAGE_SIZE = 2;
const TEST_LARGE_PAGE_SIZE = 10;
const FIRST_PAGE = 1;
const SECOND_PAGE = 2;

describe('usePokemonData', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  const mockPokemonListItems: PokemonListItem[] =
    mockPokeApiListResponse.results;

  const mockPokemonDetails: PokemonItem[] = [
    mockPokemonDetailResponses.bulbasaur,
    mockPokemonDetailResponses.charmander,
    mockPokemonDetailResponses.squirtle,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockFetchPokemonList.mockImplementation((offset: number, limit: number) => {
      if (offset === 0 && limit === 1) {
        return Promise.resolve({ results: [], total: 3 });
      }
      return Promise.resolve({ results: mockPokemonListItems, total: 3 });
    });

    mockFetchPokemonDetails.mockImplementation((url: string) => {
      const pokemon = mockPokemonDetails.find((p) => p.url === url);
      return Promise.resolve(pokemon);
    });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('should load all Pokemon on initial render and fetch details for first page', async () => {
    const { result } = renderHook(() =>
      usePokemonData('', FIRST_PAGE, TEST_PAGE_SIZE)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchPokemonList).toHaveBeenCalledWith(0, 1);
    expect(mockFetchPokemonList).toHaveBeenCalledWith(0, BATCH_LIMIT);

    expect(result.current.pokemonItems).toHaveLength(TEST_PAGE_SIZE);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.error).toBeNull();
  });

  it('should filter Pokemon by search term', async () => {
    const { result } = renderHook(() =>
      usePokemonData('char', FIRST_PAGE, TEST_LARGE_PAGE_SIZE)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemonItems).toHaveLength(1);
    expect(result.current.pokemonItems[0].name).toBe('charmander');
    expect(result.current.totalItems).toBe(1);
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

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemonItems).toHaveLength(TEST_PAGE_SIZE);

    rerender({ limit: TEST_PAGE_SIZE, page: SECOND_PAGE, searchTerm: '' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemonItems).toHaveLength(1);
    expect(result.current.totalItems).toBe(3);
  });

  it('should handle empty search results', async () => {
    const { result } = renderHook(() =>
      usePokemonData('nonexistent', FIRST_PAGE, TEST_LARGE_PAGE_SIZE)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchPokemonDetails).not.toHaveBeenCalled();
    expect(result.current.pokemonItems).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should set error state if fetchPokemonList fails', async () => {
    const errorMessage = 'API is down';

    mockFetchPokemonList.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const { result } = renderHook(() =>
      usePokemonData('', FIRST_PAGE, TEST_LARGE_PAGE_SIZE)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemonItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('should set error state if fetchPokemonDetails fails', async () => {
    const errorMessage = 'Failed to fetch details';
    mockFetchPokemonDetails.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePokemonData('', FIRST_PAGE, 1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemonItems).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should update when search term changes', async () => {
    const { rerender, result } = renderHook(
      ({ searchTerm }) =>
        usePokemonData(searchTerm, FIRST_PAGE, TEST_LARGE_PAGE_SIZE),
      { initialProps: { searchTerm: '' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.totalItems).toBe(3);
    expect(result.current.pokemonItems).toHaveLength(3);

    rerender({ searchTerm: 'bul' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.totalItems).toBe(1);
    expect(result.current.pokemonItems).toHaveLength(1);
    expect(result.current.pokemonItems[0].name).toBe('bulbasaur');
  });
});
