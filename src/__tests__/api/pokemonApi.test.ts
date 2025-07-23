import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPokemonList } from '@api/pokemonApi';

import {
  mockPokeApiListResponse,
  mockPokemonDetailResponses,
} from '../utils/mainPageMockData';

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

  it('should fetch a list of Pokemon and their details successfully', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPokeApiListResponse),
        ok: true,
      } as Response)
    );

    for (const item of mockPokeApiListResponse.results) {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPokemonDetailResponses[item.name]),
          ok: true,
        } as Response)
      );
    }

    const pokemonItems = await fetchPokemonList();

    expect(mockFetch).toHaveBeenCalledTimes(
      1 + mockPokeApiListResponse.results.length
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'
    );
    expect(pokemonItems).toHaveLength(mockPokeApiListResponse.results.length);
    expect(pokemonItems[0]).toEqual({
      id: 1,
      imageUrl: mockPokemonDetailResponses.bulbasaur.sprites.front_default,
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
    });
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should filter Pokemon by query if provided', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPokeApiListResponse),
        ok: true,
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPokemonDetailResponses['bulbasaur']),
        ok: true,
      } as Response)
    );

    const pokemonItems = await fetchPokemonList('bulba');

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(pokemonItems).toHaveLength(1);
    expect(pokemonItems[0].name).toBe('bulbasaur');
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should fetch a single Pokemon directly if query does not match list results', async () => {
    const nonMatchingListResponse = { ...mockPokeApiListResponse, results: [] };
    const singlePokemonQuery = 'pikachu';

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(nonMatchingListResponse),
        ok: true,
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve(mockPokemonDetailResponses[singlePokemonQuery]),
        ok: true,
      } as Response)
    );

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve(mockPokemonDetailResponses[singlePokemonQuery]),
        ok: true,
      } as Response)
    );

    const pokemonItems = await fetchPokemonList(singlePokemonQuery);

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://pokeapi.co/api/v2/pokemon/${singlePokemonQuery}/`
    );
    expect(pokemonItems).toHaveLength(1);
    expect(pokemonItems[0].name).toBe(singlePokemonQuery);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should return an empty array if no Pokemon are found after filtering or direct fetch', async () => {
    const emptyListResponse = { ...mockPokeApiListResponse, results: [] };

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(emptyListResponse),
        ok: true,
      } as Response)
    );
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Not Found' }),
        ok: false,
        status: 404,
      } as Response)
    );

    const pokemonItems = await fetchPokemonList('nonexistent');

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(pokemonItems).toHaveLength(0);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'No direct match for "nonexistent", and list filter yielded no results.'
    );
  });

  it('should throw an error if the initial list fetch fails', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: 'Internal Server Error' }),
        ok: false,
        status: 500,
      } as Response)
    );

    await expect(fetchPokemonList()).rejects.toThrow('Internal Server Error');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon list or details:',
      expect.any(Error)
    );
  });

  it('should throw an error if a detail fetch fails', async () => {
    const singleResultListResponse = {
      ...mockPokeApiListResponse,
      results: [mockPokeApiListResponse.results[0]],
    };

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(singleResultListResponse),
        ok: true,
      } as Response)
    );
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Not Found' }),
        ok: false,
        status: 404,
      } as Response)
    );

    await expect(fetchPokemonList()).rejects.toThrow('Not Found');
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon list or details:',
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

    await expect(fetchPokemonList()).rejects.toThrow('HTTP error! Status: 500');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to parse error response:',
      expect.any(Error)
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error fetching Pokemon list or details:',
      expect.any(Error)
    );
  });
});
