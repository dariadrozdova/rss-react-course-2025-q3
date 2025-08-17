import { useEffect, useState } from 'react';

import type { PokemonDetails } from '@/types';

const pokemonCache = new Map<string, PokemonDetails>();

export function usePokemonDetails(pokemonId: string) {
  const [pokemonDetails, setPokemonDetails] = useState<null | PokemonDetails>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!pokemonId) {
        return;
      }

      if (pokemonCache.has(pokemonId)) {
        setPokemonDetails(pokemonCache.get(pokemonId) || null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch pokemon details');
        }

        const detailsData = await response.json();
        const transformedDetails: PokemonDetails = {
          id: detailsData.id,
          name: detailsData.name,
          sprites: { front_default: detailsData.sprites.front_default },
          stats: detailsData.stats.map(
            (stats: {
              base_stat: number;
              stat: {
                name: string;
              };
            }) => ({
              base_stat: stats.base_stat,
              stat: { name: stats.stat.name },
            })
          ),
          types: detailsData.types.map(
            (types: {
              type: {
                name: string;
              };
            }) => ({
              type: { name: types.type.name },
            })
          ),
        };

        pokemonCache.set(pokemonId, transformedDetails);
        setPokemonDetails(transformedDetails);
      } catch (error_) {
        setError(error_ instanceof Error ? error_.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  return { error, isLoading, pokemonDetails };
}
