import { useMemo } from 'react';

import { useGetPokemonListQuery } from '@/api/pokemonApiSlice';
import type { UsePokemonDataResult } from '@/types/';

export const usePokemonData = (
  searchTerm: string,
  page: number,
  limit: number
): UsePokemonDataResult => {
  const {
    data: allPokemonData,
    error: listError,
    isLoading: isLoadingAll,
  } = useGetPokemonListQuery({ limit: 10_000, offset: 0 });

  const filteredPokemonList = useMemo(() => {
    if (isLoadingAll || listError) {
      return [];
    }

    if (!searchTerm) {
      return allPokemonData?.results || [];
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      allPokemonData?.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)
      ) || []
    );
  }, [allPokemonData, isLoadingAll, listError, searchTerm]);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPagePokemonItems = useMemo(
    () => filteredPokemonList.slice(startIndex, endIndex),
    [filteredPokemonList, startIndex, endIndex]
  );

  const totalFilteredItems = filteredPokemonList.length;

  return {
    error: listError ? 'Failed to fetch Pokemon list.' : null,
    isLoading: isLoadingAll,
    pokemonItems: currentPagePokemonItems,
    totalItems: totalFilteredItems,
  };
};
