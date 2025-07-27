import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPokemonItem } from '@api/pokemonApi';

describe('pokemonApi - fetchPokemonItem', () => {
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

  describe('successful requests', () => {
    const testUrl = 'https://pokeapi.co/api/v2/pokemon/pikachu/';

    it('should fetch Pokemon item with sprite successfully', async () => {
      const mockResponse = {
        id: 25,
        name: 'pikachu',
        sprites: {
          front_default: 'https://pokeapi.co/sprites/pikachu.png',
        },
        stats: [],
        types: [],
      };

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonItem(testUrl);

      expect(mockFetch).toHaveBeenCalledWith(testUrl);
      expect(result).toEqual({
        id: 25,
        imageUrl: 'https://pokeapi.co/sprites/pikachu.png',
        name: 'pikachu',
        url: testUrl,
      });
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should handle missing sprite (null front_default)', async () => {
      const mockResponse = {
        id: 999,
        name: 'testmon',
        sprites: {
          front_default: null,
        },
        stats: [],
        types: [],
      };

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
          ok: true,
        } as Response)
      );

      const result = await fetchPokemonItem(testUrl);

      expect(result).toEqual({
        id: 999,
        imageUrl: undefined,
        name: 'testmon',
        url: testUrl,
      });
    });
  });

  describe('error handling', () => {
    const testUrl = 'https://pokeapi.co/api/v2/pokemon/nonexistent/';

    it('should throw error and log warning when fetch fails', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ message: 'Not Found' }),
          ok: false,
          status: 404,
        } as Response)
      );

      await expect(fetchPokemonItem(testUrl)).rejects.toThrow('Not Found');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Could not fetch details for ${testUrl}:`,
        expect.any(Error)
      );
    });

    it('should handle JSON parsing error in error response', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.reject(new Error('Invalid JSON')),
          ok: false,
          status: 500,
        } as Response)
      );

      await expect(fetchPokemonItem(testUrl)).rejects.toThrow(
        'HTTP error! Status: 500'
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to parse error response:',
        expect.any(Error)
      );
    });
  });
});
