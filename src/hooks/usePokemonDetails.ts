import type { PokemonDetails } from '@types';
import { useEffect, useState } from 'react';

import { fetchPokemonDetails } from '@api/pokemonApi';

export const usePokemonDetails = (id: string | undefined) => {
  const [pokemon, setPokemon] = useState<null | PokemonDetails>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;

        const data = await fetchPokemonDetails(pokemonUrl);
        setPokemon(data);
      } catch (error_) {
        if (error_ instanceof Error) {
          setError(error_.message || 'Failed to fetch Pokémon details.');
        } else {
          setError('An unknown error occurred while fetching details.');
        }
        console.warn(error_);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  return { error, isLoading, pokemon };
};
