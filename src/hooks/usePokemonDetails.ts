import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useGetPokemonDetailsQuery } from '@/api/pokemonApiSlice';
import type { PokemonDetails } from '@/types/';

interface SerializedError {
  code?: string;
  message?: string;
  name?: string;
  stack?: string;
}

export const usePokemonDetails = (
  id: string | undefined
): {
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  pokemon: PokemonDetails | undefined;
} => {
  const {
    data: pokemon,
    error,
    isLoading,
  } = useGetPokemonDetailsQuery(id as string, {
    skip: !id,
  });

  return { error, isLoading, pokemon };
};
