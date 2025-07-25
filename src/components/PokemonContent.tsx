import type { PokemonItem } from '@types';
import React from 'react';

import CardList from './CardList';
import Loader from './Loader';
import Pagination from './Pagination';

interface PokemonContentProps {
  currentPage: number;
  effectiveSearchTerm: string;
  error: null | string;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  pokemonItems: PokemonItem[];
  totalItems: null | number;
  totalPages: number;
}

export const PokemonContent: React.FC<PokemonContentProps> = ({
  currentPage,
  effectiveSearchTerm,
  error,
  isLoading,
  onPageChange,
  pokemonItems,
  totalItems,
  totalPages,
}) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <p className="text-[var(--color-primary-red-hover)] bg-[var(--color-error-background)] border border-[var(--color-error-border-light)] p-[15px] rounded-md mt-[20px] font-semibold text-center w-full max-w-[550px] box-border md:p-[10px] md:text-[0.9em]">
        Error: {error}
      </p>
    );
  }

  if (pokemonItems.length === 0) {
    if (effectiveSearchTerm) {
      return (
        <p className="bg-[var(--color-black-alpha-10)] border border-[var(--color-black-alpha-15)] p-[15px] rounded-md mt-[20px] text-gray-800 text-center w-full max-w-[550px] box-border md:p-[10px] md:text-[0.9em]">
          No Pokemon found for "{effectiveSearchTerm}". Try a different search!
        </p>
      );
    }
    if (totalItems === 0) {
      return (
        <p className="bg-[var(--color-black-alpha-10)] border border-[var(--color-black-alpha-15)] p-[15px] rounded-md mt-[20px] text-gray-800 text-center w-full max-w-[550px] box-border md:p-[10px] md:text-[0.9em]">
          No Pokemon to display.
        </p>
      );
    }
  }

  return (
    <>
      <CardList pokemonItems={pokemonItems} />
      {totalItems !== null && totalItems > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}
    </>
  );
};
