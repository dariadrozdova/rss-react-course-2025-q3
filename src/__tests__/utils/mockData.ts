import type { PokemonItem } from '../../types/types';

export const mockPokemonItemWithImage: PokemonItem = {
  id: 1,
  name: 'Pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
  imageUrl: 'https://example.com/pikachu.png',
};

export const mockPokemonItemWithoutImage: PokemonItem = {
  id: 2,
  name: 'Charmander',
  url: 'https://pokeapi.co/api/v2/pokemon/charmander',
  imageUrl: '',
};

export const mockPokemonItemUndefinedImage: PokemonItem = {
  id: 3,
  name: 'Squirtle',
  url: 'https://pokeapi.co/api/v2/pokemon/squirtle',
};

export const mockPokemonItemsList: PokemonItem[] = [
  {
    id: 10,
    name: 'Bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
    imageUrl: 'https://example.com/bulbasaur.png',
  },
  {
    id: 20,
    name: 'Squirtle',
    url: 'https://pokeapi.co/api/v2/pokemon/squirtle',
    imageUrl: '',
  },
  {
    id: 30,
    name: 'Charmander',
    url: 'https://pokeapi.co/api/v2/pokemon/charmander',
  },
];
