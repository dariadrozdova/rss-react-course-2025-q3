import type { ReactNode } from 'react';

export interface CardListProps {
  currentPage: number;
  onPokemonClick?: (pokemonId: number) => void;
  pokemonItems: PokemonItem[];
  selectedPokemonId?: number;
}

export interface CardProps {
  currentPage: number;
  isSelected?: boolean;
  item: PokemonItem;
  onPokemonClick?: (pokemonId: number) => void;
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
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: null | string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
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
