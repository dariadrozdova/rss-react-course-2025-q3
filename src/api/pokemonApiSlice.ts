import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PokemonDetailResponse,
  PokemonDetails,
  PokemonItem,
  PokemonListResponse,
} from '@types';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://pokeapi.co/api/v2/',
});

export const pokemonApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getPokemonDetails: builder.query<PokemonDetails, string>({
      providesTags: (_result, _error, name) => [
        { id: name, type: 'PokemonDetails' as const },
      ],
      query: (name) => `pokemon/${name}`,
      transformResponse: (response: PokemonDetailResponse) => ({
        id: response.id,
        name: response.name,
        sprites: {
          front_default: response.sprites.front_default,
        },
        stats: response.stats.map((stat) => ({
          base_stat: stat.base_stat,
          stat: {
            name: stat.stat.name,
          },
        })),
        types: response.types.map((type) => ({
          type: {
            name: type.type.name,
          },
        })),
      }),
    }),
    getPokemonList: builder.query<
      { results: PokemonItem[]; total: number },
      { limit: number; offset: number }
    >({
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ name }) => ({
                id: name,
                type: 'PokemonList' as const,
              })),
              { id: 'LIST', type: 'PokemonList' },
            ]
          : [{ id: 'LIST', type: 'PokemonList' }],
      query: ({ limit, offset }) => `pokemon?limit=${limit}&offset=${offset}`,
      transformResponse: (response: PokemonListResponse) => {
        const results: PokemonItem[] = response.results.map((item) => {
          const idMatch = item.url.match(/\/(\d+)\/$/);
          const id = idMatch ? Number.parseInt(idMatch[1], 10) : 0;
          return {
            ...item,
            id,
            imageUrl: undefined,
          };
        });

        return {
          results,
          total: response.count,
        };
      },
    }),
  }),
  reducerPath: 'pokemonApi',
  tagTypes: ['Pokemon', 'PokemonList', 'PokemonDetails'],
});

export const { useGetPokemonDetailsQuery, useGetPokemonListQuery } = pokemonApi;
