import type { ReactNode } from 'react';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonItem {
  name: string;
  url: string;
  imageUrl?: string;
  id: number;
}

export interface MainPageState {
  searchTerm: string;
  pokemonItems: PokemonItem[];
  isLoading: boolean;
  error: string | null;
}

export interface SearchProps {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm: string;
}

export interface SearchState {
  inputValue: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}
