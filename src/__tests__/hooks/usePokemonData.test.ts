import { renderHook, waitFor } from '@testing-library/react';
import type { PokemonItem } from '@types';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPokemonList } from '@api/pokemonApi';
import { usePokemonData } from '@hooks/usePokemonData';

vi.mock('../../api/pokemonApi', () => ({
  fetchPokemonList: vi.fn(),
}));

describe('usePokemonData', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue([]);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('should fetch data on initial render with default query', async () => {
    const mockItems: PokemonItem[] = [
      { id: 1, imageUrl: 'url1', name: 'bulbasaur', url: 'url1' },
    ];
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(mockItems);

    const { result } = renderHook(() => usePokemonData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchPokemonList).toHaveBeenCalledTimes(1);
    expect(fetchPokemonList).toHaveBeenCalledWith('');
    expect(result.current.pokemonItems).toEqual(mockItems);
    expect(result.current.error).toBeNull();
  });

  it('should fetch data on initial render with provided initial query', async () => {
    const mockItems: PokemonItem[] = [
      { id: 1, imageUrl: 'url2', name: 'charmander', url: 'url2' },
    ];
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockResolvedValue(mockItems);

    const { result } = renderHook(() => usePokemonData('charmander'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchPokemonList).toHaveBeenCalledTimes(1);
    expect(fetchPokemonList).toHaveBeenCalledWith('charmander');
    expect(result.current.pokemonItems).toEqual(mockItems);
    expect(result.current.error).toBeNull();
  });

  it('should update data when fetchData is called with a new query', async () => {
    const initialItems: PokemonItem[] = [
      { id: 1, imageUrl: 'url', name: 'initial', url: 'url' },
    ];
    const newItems: PokemonItem[] = [
      { id: 2, imageUrl: 'new_url', name: 'new', url: 'new_url' },
    ];

    (fetchPokemonList as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(initialItems)
      .mockResolvedValueOnce(newItems);

    const { result } = renderHook(() => usePokemonData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.pokemonItems).toEqual(initialItems);
    expect(fetchPokemonList).toHaveBeenCalledTimes(1);
    expect(fetchPokemonList).toHaveBeenCalledWith('');

    await act(async () => {
      await result.current.fetchData('newQuery');
    });

    await waitFor(() => {
      expect(result.current.pokemonItems).toEqual(newItems);
    });

    expect(fetchPokemonList).toHaveBeenCalledTimes(2);
    expect(fetchPokemonList).toHaveBeenCalledWith('newQuery');
    expect(result.current.pokemonItems).toEqual(newItems);
    expect(result.current.error).toBeNull();
  });

  it('should set error state if fetchPokemonList fails', async () => {
    const errorMessage = 'API is down';
    (fetchPokemonList as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => usePokemonData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchPokemonList).toHaveBeenCalledTimes(1);
    expect(result.current.pokemonItems).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error in usePokemonData fetchData:',
      expect.any(Error)
    );
  });
});
