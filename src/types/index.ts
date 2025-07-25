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

export interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: {
    front_default: null | string;
  };
}

export interface PokemonItem {
  id: number;
  imageUrl: string | undefined;
  name: string;
  url: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: PokemonListItem[];
}

export interface SearchProps {
  initialSearchTerm: string;
  onSearch: (searchTerm: string) => void;
}

export interface SearchState {
  inputValue: string;
}

export interface UsePokemonDataResult {
  error: null | string;
  isLoading: boolean;
  pokemonItems: PokemonItem[];
  totalItems: null | number;
}
