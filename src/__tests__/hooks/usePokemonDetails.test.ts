import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePokemonDetails } from '@/hooks/usePokemonDetails';

vi.mock('@/api/pokemonApiSlice', () => ({
  useGetPokemonDetailsQuery: vi.fn(),
}));

import { useGetPokemonDetailsQuery } from '@/api/pokemonApiSlice';
const mockUseGetPokemonDetailsQuery = useGetPokemonDetailsQuery as ReturnType<
  typeof vi.fn
>;

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
      mockUseGetPokemonDetailsQuery.mockReturnValue({
        data: undefined,
        error: undefined,
        isError: false,
        isFetching: false,
        isLoading: false,
        isSuccess: false,
        refetch: vi.fn(),
      });

      const noId = null as unknown as string | undefined;
      const { result } = renderHook(() => usePokemonDetails(noId));

      expect(result.current).toEqual({
        error: undefined,
        isLoading: false,
        pokemon: undefined,
      });
    });

    it('starts loading when id is provided', () => {
      mockUseGetPokemonDetailsQuery.mockReturnValue({
        data: undefined,
        error: undefined,
        isError: false,
        isFetching: true,
        isLoading: true,
        isSuccess: false,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => usePokemonDetails('1'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.pokemon).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('successful fetch', () => {
    it('returns pokemon data on successful fetch', () => {
      mockUseGetPokemonDetailsQuery.mockReturnValue({
        data: mockPokemonData,
        error: undefined,
        isError: false,
        isFetching: false,
        isLoading: false,
        isSuccess: true,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => usePokemonDetails('1'));

      expect(result.current.pokemon).toEqual(mockPokemonData);
      expect(result.current.error).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(mockUseGetPokemonDetailsQuery).toHaveBeenCalledWith('1', {
        skip: false,
      });
    });
  });

  describe('error handling', () => {
    it.each([
      [
        'Error instance',
        { message: 'Network error' },
        { message: 'Network error' },
      ],
      [
        'Error without message',
        { message: 'empty message' },
        { message: 'empty message' },
      ],
      [
        'API error',
        { data: 'Not found', status: 404 },
        { data: 'Not found', status: 404 },
      ],
    ])('handles %s correctly', (_, mockError, expectedError) => {
      mockUseGetPokemonDetailsQuery.mockReturnValue({
        data: undefined,
        error: mockError,
        isError: true,
        isFetching: false,
        isLoading: false,
        isSuccess: false,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => usePokemonDetails('1'));

      expect(result.current.error).toEqual(expectedError);
      expect(result.current.pokemon).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('id changes', () => {
    it('calls hook with new id when id changes', () => {
      mockUseGetPokemonDetailsQuery.mockReturnValue({
        data: mockPokemonData,
        error: undefined,
        isError: false,
        isFetching: false,
        isLoading: false,
        isSuccess: true,
        refetch: vi.fn(),
      });

      const { rerender } = renderHook(
        ({ id }: { id: string | undefined }) => usePokemonDetails(id),
        { initialProps: { id: '1' as string | undefined } }
      );

      expect(mockUseGetPokemonDetailsQuery).toHaveBeenCalledWith('1', {
        skip: false,
      });

      rerender({ id: '2' as string | undefined });

      expect(mockUseGetPokemonDetailsQuery).toHaveBeenCalledWith('2', {
        skip: false,
      });
    });
  });
});
