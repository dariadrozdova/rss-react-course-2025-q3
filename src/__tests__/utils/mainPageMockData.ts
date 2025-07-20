import type { PokemonItem } from '../../types/types';

export const mockPokeApiListResponse = {
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
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
  },
  charmander: {
    id: 4,
    name: 'charmander',
    url: 'https://pokeapi.co/api/v2/pokemon/charmander/',
    sprites: { front_default: 'https://example.com/charmander.png' },
  },
  squirtle: {
    id: 7,
    name: 'squirtle',
    url: 'https://pokeapi.co/api/v2/pokemon/squirtle/',
    sprites: { front_default: 'https://example.com/squirtle.png' },
  },
  pikachu: {
    id: 25,
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
    sprites: { front_default: 'https://example.com/pikachu.png' },
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
