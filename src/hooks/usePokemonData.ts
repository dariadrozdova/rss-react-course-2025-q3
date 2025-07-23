import type { PokemonItem } from '@types';
import { useCallback, useEffect, useState } from 'react';

import { fetchPokemonList } from '../api/pokemonApi';

interface UsePokemonDataResult {
  error: null | string;
  fetchData: (query?: string) => Promise<void>;
  isLoading: boolean;
  pokemonItems: PokemonItem[];
}

export const usePokemonData = (
  initialQuery: string = ''
): UsePokemonDataResult => {
  const [pokemonItems, setPokemonItems] = useState<PokemonItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const fetchData = useCallback(
    async (query?: string) => {
      const searchQuery = query === undefined ? initialQuery : query;

      setIsLoading(true);
      setError(null);
      setPokemonItems([]);

      try {
        const data = await fetchPokemonList(searchQuery);
        setPokemonItems(data);
      } catch (error_: any) {
        setError(
          error_.message || 'An unknown error occurred while fetching Pokemon.'
        );
        console.warn('Error in usePokemonData fetchData:', error_);
      } finally {
        setIsLoading(false);
      }
    },
    [initialQuery]
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { error, fetchData, isLoading, pokemonItems };
};
