import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PokemonDetailResponse,
  PokemonDetails,
  PokemonItem,
  PokemonListResponse,
} from '@types';

const HTTP_STATUS_NOT_FOUND = 404;

const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read blob as Data URL.'));
      }
    };
    reader.addEventListener('error', reject);
    reader.readAsDataURL(blob);
  });
};

const baseQueryWithImageHandling = fetchBaseQuery({
  baseUrl: 'https://pokeapi.co/api/v2/',
});

const customBaseQuery: typeof baseQueryWithImageHandling = async (
  arguments_,
  api,
  extraOptions
) => {
  if (
    typeof arguments_ === 'string' &&
    arguments_.startsWith('https://raw.githubusercontent.com')
  ) {
    const result = await fetchBaseQuery({
      baseUrl: '/',
      responseHandler: (response) => response.blob(),
    })(arguments_, api, extraOptions);
    return result;
  }
  return baseQueryWithImageHandling(arguments_, api, extraOptions);
};

export const pokemonApi = createApi({
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getPokemonDetails: builder.query<PokemonDetails, string>({
      async onQueryStarted(_name, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const imageUrl = data.sprites.front_default;
          if (imageUrl) {
            dispatch(pokemonApi.endpoints.getPokemonImage.initiate(imageUrl));
          }
        } catch (error) {
          console.warn('Failed to pre-fetch pokemon image:', error);
        }
      },
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

    getPokemonImage: builder.query<null | string, string>({
      keepUnusedDataFor: 600,
      providesTags: (_result, _error, url) => [
        { id: url, type: 'PokemonImage' },
      ],
      queryFn: async (
        url,
        { signal }
      ): Promise<{ data: null | string } | { error: FetchBaseQueryError }> => {
        try {
          const response = await fetch(url, { signal });

          if (!response.ok) {
            if (response.status === HTTP_STATUS_NOT_FOUND) {
              return { data: null };
            }
            return {
              error: {
                data: await response.text(),
                status: response.status,
              } as FetchBaseQueryError,
            };
          }

          const blob = await response.blob();
          const dataUrl = await blobToDataUrl(blob);
          return { data: dataUrl };
        } catch (error) {
          return {
            error: {
              error: error instanceof Error ? error.message : String(error),
              status: 'FETCH_ERROR',
            } as FetchBaseQueryError,
          };
        }
      },
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
  tagTypes: ['Pokemon', 'PokemonList', 'PokemonDetails', 'PokemonImage'],
});

export const {
  useGetPokemonDetailsQuery,
  useGetPokemonImageQuery,
  useGetPokemonListQuery,
} = pokemonApi;
