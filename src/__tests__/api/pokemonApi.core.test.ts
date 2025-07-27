import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPokemonDetails, fetchPokemonList } from '@api/pokemonApi';

import { mockPokeApiListResponse } from '../utils/mainPageMockData';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;
const CUSTOM_OFFSET = 40;
const CUSTOM_LIMIT = 10;

describe('pokemonApi - Core Functions', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    consoleWarnSpy.mockRestore();
  });

  describe('fetchPokemonList', () => {
    beforeEach(() => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPokeApiListResponse),
          ok: true,
        } as Response)
      );
    });

    it.each([
      {
        description: 'default parameters',
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
      },
      {
        description: 'custom parameters',
        limit: CUSTOM_LIMIT,
        offset: CUSTOM_OFFSET,
      },
    ])(
      'should fetch Pokemon list with $description',
      async ({ limit, offset }) => {
        const result = await fetchPokemonList(offset, limit);

        expect(mockFetch).toHaveBeenCalledWith(
          `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
        );
        expect(result.results).toEqual(mockPokeApiListResponse.results);
        expect(typeof result.total).toBe('number');
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      }
    );
  });

  describe('fetchPokemonDetails', () => {
    const testUrl = 'https://pokeapi.co/api/v2/pokemon/bulbasaur/';
    const mockDetailResponse = {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        front_default: 'https://pokeapi.co/sprites/bulbasaur.png',
      },
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      types: [{ type: { name: 'grass' } }],
    };

    beforeEach(() => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockDetailResponse),
          ok: true,
        } as Response)
      );
    });

    it('should fetch Pokemon details successfully', async () => {
      const result = await fetchPokemonDetails(testUrl);

      expect(mockFetch).toHaveBeenCalledWith(testUrl);
      expect(result).toEqual({
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default: 'https://pokeapi.co/sprites/bulbasaur.png',
        },
        stats: [{ base_stat: 45, stat: { name: 'hp' } }],
        types: [{ type: { name: 'grass' } }],
      });
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should handle missing sprite image', async () => {
      const mockResponse = {
        id: 999,
        name: 'testmon',
        sprites: { front_default: null },
        stats: [],
        types: [],
      };

      mockFetch.mockReset();
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonDetails(testUrl);
      expect(result.sprites.front_default).toBeNull();
    });
  });
});
