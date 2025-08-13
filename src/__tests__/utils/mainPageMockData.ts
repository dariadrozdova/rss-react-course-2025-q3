import type { PokemonItem } from '@/types/';

export const mockPokeApiListResponse = {
  count: 1010,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/' },
    {
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/charmander/',
    },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/squirtle/' },
  ],
};

export const mockPokemonDetailResponses: Record<
  string,
  PokemonItem & { sprites: { front_default: string } }
> = {
  bulbasaur: {
    id: 1,
    imageUrl: 'https://example.com/bulbasaur.png',
    name: 'bulbasaur',
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
    url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
  },
  charmander: {
    id: 4,
    imageUrl: 'https://example.com/charmander.png',
    name: 'charmander',
    sprites: { front_default: 'https://example.com/charmander.png' },
    url: 'https://pokeapi.co/api/v2/pokemon/charmander/',
  },
  pikachu: {
    id: 25,
    imageUrl: 'https://example.com/pikachu.png',
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
  },
  squirtle: {
    id: 7,
    imageUrl: 'https://example.com/squirtle.png',
    name: 'squirtle',
    sprites: { front_default: 'https://example.com/squirtle.png' },
    url: 'https://pokeapi.co/api/v2/pokemon/squirtle/',
  },
};

export const singleItemResponse = {
  results: [
    {
      name: 'testpokemon',
      url: 'https://pokeapi.co/api/v2/pokemon/testpokemon/',
    },
  ],
};

export const emptyResultsList = {
  results: [],
};
