import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPokemonDetails, fetchPokemonList } from '@api/pokemonApi';

import { mockPokeApiListResponse } from '../utils/mainPageMockData';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;
const CUSTOM_OFFSET = 40;
const CUSTOM_LIMIT = 10;

describe('pokemonApi', () => {
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
    it('should fetch a list of Pokemon successfully', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPokeApiListResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonList(DEFAULT_OFFSET, DEFAULT_LIMIT);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://pokeapi.co/api/v2/pokemon/?limit=${DEFAULT_LIMIT}&offset=${DEFAULT_OFFSET}`
      );
      expect(result.results).toEqual(mockPokeApiListResponse.results);
      expect(typeof result.total).toBe('number');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should fetch with custom offset and limit', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPokeApiListResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonList(CUSTOM_OFFSET, CUSTOM_LIMIT);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://pokeapi.co/api/v2/pokemon/?limit=${CUSTOM_LIMIT}&offset=${CUSTOM_OFFSET}`
      );
      expect(result.results).toEqual(mockPokeApiListResponse.results);
      expect(typeof result.total).toBe('number');
    });

    it('should throw an error if the list fetch fails', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ error: 'Internal Server Error' }),
          ok: false,
          status: 500,
        } as Response)
      );

      await expect(
        fetchPokemonList(DEFAULT_OFFSET, DEFAULT_LIMIT)
      ).rejects.toThrow('Internal Server Error');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error in fetchPokemonList (basic list):',
        expect.any(Error)
      );
    });

    it('should handle JSON parsing error during http response handling', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.reject(new Error('Invalid JSON')),
          ok: false,
          status: 500,
        } as Response)
      );

      await expect(
        fetchPokemonList(DEFAULT_OFFSET, DEFAULT_LIMIT)
      ).rejects.toThrow('HTTP error! Status: 500');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to parse error response:',
        expect.any(Error)
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error in fetchPokemonList (basic list):',
        expect.any(Error)
      );
    });
  });

  describe('fetchPokemonDetails', () => {
    it('should fetch Pokemon details successfully', async () => {
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

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockDetailResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonDetails(testUrl);

      expect(mockFetch).toHaveBeenCalledTimes(1);
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
      const testUrl = 'https://pokeapi.co/api/v2/pokemon/test/';
      const mockResponse = {
        id: 999,
        name: 'testmon',
        sprites: { front_default: null },
        stats: [],
        types: [],
      };

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonDetails(testUrl);

      expect(result.sprites.front_default).toBeNull();
    });

    it('should throw an error if detail fetch fails', async () => {
      const testUrl = 'https://pokeapi.co/api/v2/pokemon/nonexistent/';
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ message: 'Not Found' }),
          ok: false,
          status: 404,
        } as Response)
      );

      await expect(fetchPokemonDetails(testUrl)).rejects.toThrow('Not Found');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Could not fetch details for ${testUrl}:`,
        expect.any(Error)
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should work together to fetch list and details', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPokeApiListResponse),
          ok: true,
        } as Response)
      );

      const listResult = await fetchPokemonList(DEFAULT_OFFSET, DEFAULT_LIMIT);

      const mockDetailResponse = {
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'url' },
        stats: [],
        types: [],
      };

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockDetailResponse),
          ok: true,
        } as Response)
      );

      const detailResult = await fetchPokemonDetails(listResult.results[0].url);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(listResult.results).toHaveLength(
        mockPokeApiListResponse.results.length
      );
      expect(detailResult.name).toBe('bulbasaur');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
