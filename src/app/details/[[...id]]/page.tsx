import PokemonPageClient from './PokemonPageClient';

export default async function PokemonPage() {
  const pokemonListResponse = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0'
  );
  const pokemonListData = await pokemonListResponse.json();

  const pokemonList = pokemonListData.results.map((item: any) => {
    const idMatch = item.url.match(/\/(\d+)\/$/);
    const id = idMatch ? Number.parseInt(idMatch[1], 10) : 0;
    return {
      ...item,
      id,
      imageUrl: undefined,
    };
  });

  return (
    <PokemonPageClient
      pokemonList={pokemonList}
      totalCount={pokemonListData.count}
    />
  );
}
