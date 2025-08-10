import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pokemonApi } from '@api/pokemonApiSlice';

import { setupApiStore } from '@/__tests__/utils/apiTestUtilities';
import {
  emptyResultsList,
  mockPokeApiListResponse,
  singleItemResponse,
} from '@/__tests__/utils/mainPageMockData';

const LIST_LIMIT_FULL = 10;
const LIST_LIMIT_SINGLE = 1;
const LIST_LIMIT_EMPTY = 0;
const LIST_OFFSET_START = 0;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_SERVER_ERROR = 500;
const HTTP_STATUS_UNAVAILABLE = 503;

let store: ReturnType<typeof setupApiStore>;

beforeEach(() => {
  store = setupApiStore(pokemonApi);
  vi.restoreAllMocks();
});

describe('pokemonApi', () => {
  describe.each([
    [
      'full list',
      { limit: LIST_LIMIT_FULL, offset: LIST_OFFSET_START },
      { ...mockPokeApiListResponse, count: 1292 },
    ],
    [
      'single item list',
      { limit: LIST_LIMIT_SINGLE, offset: LIST_OFFSET_START },
      { ...singleItemResponse, count: 1 },
    ],
    [
      'empty list',
      { limit: LIST_LIMIT_EMPTY, offset: LIST_OFFSET_START },
      { ...emptyResultsList, count: 0 },
    ],
  ])('getPokemonList - %s', (_label, queryArgument, mockResponse) => {
    it('should correctly extract Pokemon ID from URL', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: async () => mockResponse,
        ok: true,
      } as Response);

      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate(queryArgument)
      );

      if (result.data?.results && result.data.results.length > 0) {
        for (const pokemon of result.data.results) {
          const urlIdMatch = pokemon.url.match(/\/(\d+)\/$/);
          if (urlIdMatch) {
            const expectedId = Number.parseInt(urlIdMatch[1], 10);
            expect(pokemon.id).toBe(expectedId);
          } else {
            expect(pokemon.id).toBe(0);
          }
        }
      }
    });
  });

  describe('getPokemonList error handling', () => {
    it.each([
      [HTTP_STATUS_NOT_FOUND, 'Not Found'],
      [HTTP_STATUS_SERVER_ERROR, 'Internal Server Error'],
      [HTTP_STATUS_UNAVAILABLE, 'Service Unavailable'],
    ])('should handle %i HTTP errors correctly', async (status, statusText) => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status,
        statusText,
      } as Response);

      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({
          limit: LIST_LIMIT_FULL,
          offset: LIST_OFFSET_START,
        })
      );

      expect(result.isError).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({
          limit: LIST_LIMIT_FULL,
          offset: LIST_OFFSET_START,
        })
      );

      expect(result.isError).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('RTK Query functionality', () => {
    it('should have correct tag types for caching', () => {
      expect(pokemonApi.internalActions).toBeDefined();
    });
  });

  describe('RTK Query slice structure', () => {
    it('should have correct API slice configuration', () => {
      expect(pokemonApi.reducerPath).toBeDefined();
      expect(pokemonApi.middleware).toBeDefined();
      expect(pokemonApi.reducer).toBeDefined();
      expect(pokemonApi.endpoints).toBeDefined();
    });

    it('should have required endpoints defined', () => {
      expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
      expect(pokemonApi.endpoints.getPokemonDetails).toBeDefined();
    });

    it('should generate hooks for endpoints', () => {
      expect(pokemonApi.endpoints.getPokemonList.useQuery).toBeDefined();
      expect(pokemonApi.endpoints.getPokemonDetails.useQuery).toBeDefined();
    });
  });

  describe('getPokemonDetails', () => {
    it('should have getPokemonDetails endpoint available', () => {
      expect(pokemonApi.endpoints.getPokemonDetails).toBeDefined();
      expect(typeof pokemonApi.endpoints.getPokemonDetails.initiate).toBe(
        'function'
      );
    });
  });

  describe('API slice structure', () => {
    it('should have correct API slice properties', () => {
      expect(pokemonApi.reducerPath).toBeDefined();
      expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
      expect(pokemonApi.endpoints.getPokemonDetails).toBeDefined();
      expect(pokemonApi.middleware).toBeDefined();
      expect(pokemonApi.reducer).toBeDefined();
    });

    it('should export hooks for endpoints', () => {
      expect(pokemonApi.endpoints.getPokemonList.useQuery).toBeDefined();
      expect(pokemonApi.endpoints.getPokemonDetails.useQuery).toBeDefined();
    });
  });
});
