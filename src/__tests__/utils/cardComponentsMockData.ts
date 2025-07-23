import type { PokemonItem } from '@types';

export const mockPokemonItemWithImage: PokemonItem = {
  id: 1,
  imageUrl: 'https://example.com/pikachu.png',
  name: 'Pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
};

export const mockPokemonItemWithoutImage: PokemonItem = {
  id: 2,
  imageUrl: '',
  name: 'Charmander',
  url: 'https://pokeapi.co/api/v2/pokemon/charmander',
};

export const mockPokemonItemUndefinedImage: PokemonItem = {
  id: 3,
  name: 'Squirtle',
  url: 'https://pokeapi.co/api/v2/pokemon/squirtle',
};

export const mockPokemonItemsList: PokemonItem[] = [
  {
    id: 10,
    imageUrl: 'https://example.com/bulbasaur.png',
    name: 'Bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
  },
  {
    id: 20,
    imageUrl: '',
    name: 'Squirtle',
    url: 'https://pokeapi.co/api/v2/pokemon/squirtle',
  },
  {
    id: 30,
    name: 'Charmander',
    url: 'https://pokeapi.co/api/v2/pokemon/charmander',
  },
];
