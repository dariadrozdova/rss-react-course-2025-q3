import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePokemonDetails } from '@hooks/usePokemonDetails';

vi.mock('@api/pokemonApi');
import { fetchPokemonDetails } from '@api/pokemonApi';
const mockFetchPokemonDetails = vi.mocked(fetchPokemonDetails);

const mockPokemonData = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'image-url' },
  stats: [{ base_stat: 45, stat: { name: 'hp' } }],
  types: [{ type: { name: 'grass' } }],
};

describe('usePokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns initial values when no id provided', () => {
      const noId = null as unknown as string | undefined;
      const { result } = renderHook(() => usePokemonDetails(noId));

      expect(result.current).toEqual({
        error: null,
        isLoading: false,
        pokemon: null,
      });
    });

    it('starts loading when id is provided', () => {
      mockFetchPokemonDetails.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => usePokemonDetails('1'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.pokemon).toBe(null);
      expect(result.current.error).toBe(null);
    });
  });

  describe('successful fetch', () => {
    it('returns pokemon data on successful fetch', async () => {
      mockFetchPokemonDetails.mockResolvedValue(mockPokemonData);

      const { result } = renderHook(() => usePokemonDetails('1'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pokemon).toEqual(mockPokemonData);
      expect(result.current.error).toBe(null);
      expect(mockFetchPokemonDetails).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1/'
      );
    });
  });

  describe('error handling', () => {
    it.each([
      ['Error instance', new Error('Network error'), 'Network error'],
      ['Error without message', new Error('empty message'), 'empty message'],
      [
        'Unknown error',
        'string error',
        'An unknown error occurred while fetching details.',
      ],
    ])('handles %s correctly', async (_, mockError, expectedMessage) => {
      mockFetchPokemonDetails.mockRejectedValue(mockError);

      const { result } = renderHook(() => usePokemonDetails('1'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(expectedMessage);
      expect(result.current.pokemon).toBe(null);
    });
  });

  describe('id changes', () => {
    it('refetches data when id changes', async () => {
      mockFetchPokemonDetails.mockResolvedValue(mockPokemonData);

      const { rerender, result } = renderHook(
        ({ id }: { id: string | undefined }) => usePokemonDetails(id),
        { initialProps: { id: '1' as string | undefined } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      rerender({ id: '2' as string | undefined });

      expect(result.current.isLoading).toBe(true);
      expect(mockFetchPokemonDetails).toHaveBeenCalledTimes(2);
      expect(mockFetchPokemonDetails).toHaveBeenLastCalledWith(
        'https://pokeapi.co/api/v2/pokemon/2/'
      );
    });
  });
});
