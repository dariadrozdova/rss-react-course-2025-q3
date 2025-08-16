import { Suspense } from 'react';

import PokemonPageClient from './PokemonPageClient';

import type { PokemonItem } from '@/types';

export default async function HomePage() {
  const pokemonListResponse = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0'
  );
  const pokemonListData = await pokemonListResponse.json();

  const pokemonList = pokemonListData.results.map((item: PokemonItem) => {
    const idMatch = item.url.match(/\/(\d+)\/$/);
    const id = idMatch ? Number.parseInt(idMatch[1], 10) : 0;
    return {
      ...item,
      id,
      imageUrl: undefined,
    };
  });

  return (
    <Suspense>
      <PokemonPageClient
        pokemonList={pokemonList}
        totalCount={pokemonListData.count}
      />
    </Suspense>
  );
}
