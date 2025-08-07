import React from 'react';

import type { PokemonItem } from '@types';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@utils/cn';

import CardList from './CardList';
import Pagination from './Pagination';
import SkeletonCardList from './SkeletonCardList';

interface PokemonContentProps {
  currentPage: number;
  effectiveSearchTerm: string;
  error: null | string;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPokemonClick?: (pokemonId: number) => void;
  pokemonItems: PokemonItem[];
  selectedPokemonId?: number;
  totalItems: null | number;
  totalPages: number;
}

export const PokemonContent: React.FC<PokemonContentProps> = ({
  currentPage,
  effectiveSearchTerm,
  error,
  isLoading,
  onPageChange,
  onPokemonClick,
  pokemonItems,
  selectedPokemonId,
  totalItems,
  totalPages,
}) => {
  const showPagination =
    totalItems !== null && totalItems > 0 && totalPages > 1;
  const message = effectiveSearchTerm
    ? `No Pokemon found for "${effectiveSearchTerm}". Try a different search!`
    : totalItems === 0
      ? 'No Pokemon to display.'
      : '';

  return (
    <div className={cn('min-h-[800px] w-full flex flex-col')}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={cn('flex-grow')}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="loader"
          >
            <SkeletonCardList count={20} />
          </motion.div>
        ) : error ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={cn('flex-grow flex items-center justify-center')}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="error"
          >
            <p
              className={cn(
                'text-[var(--color-primary-red-hover)] bg-[var(--color-error-background)] border border-[var(--color-error-border-light)] p-[15px] rounded-md font-semibold text-center w-full max-w-xl box-border md:p-[10px] md:text-[0.9em]'
              )}
            >
              Error: {error}
            </p>
          </motion.div>
        ) : pokemonItems.length === 0 ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={cn('flex-grow flex items-center justify-center')}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="empty"
          >
            <p
              className={cn(
                'bg-[var(--color-black-alpha-10)] border border-[var(--color-black-alpha-15)] p-[15px] rounded-md text-gray-800 text-center w-full max-w-xl box-border md:p-[10px] md:text-[0.9em]'
              )}
            >
              {message}
            </p>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className={cn('flex-grow')}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="content"
          >
            <CardList
              currentPage={currentPage}
              {...(onPokemonClick ? { onPokemonClick } : {})}
              pokemonItems={pokemonItems}
              {...(selectedPokemonId === undefined
                ? {}
                : { selectedPokemonId })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn('flex-shrink-0 mt-auto')}>
        {(showPagination || isLoading) && (
          <div
            className={cn(
              'transition-opacity duration-300',
              isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            <Pagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
};
