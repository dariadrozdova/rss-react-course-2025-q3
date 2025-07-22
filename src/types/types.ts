import type { ReactNode } from 'react';

export interface CardListProps {
  pokemonItems: PokemonItem[];
}

export interface CardProps {
  item: PokemonItem;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface MainPageState {
  error: null | string;
  isLoading: boolean;
  pokemonItems: PokemonItem[];
  searchTerm: string;
  throwError: boolean;
}

export interface PokemonItem {
  id: number;
  imageUrl?: string;
  name: string;
  url: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface SearchProps {
  initialSearchTerm: string;
  onSearch: (searchTerm: string) => void;
}

export interface SearchState {
  inputValue: string;
}
