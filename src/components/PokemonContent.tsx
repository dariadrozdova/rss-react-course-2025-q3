import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import CardList from './CardList';
import Pagination from './Pagination';
import SkeletonCardList from './SkeletonCardList';

import type { PokemonContentProps } from '@/types';

import { classNames } from '@/utils/classNames';

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
    <div className="min-h-[50rem] w-full flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex-grow"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="loader"
          >
            <SkeletonCardList count={20} />
          </motion.div>
        ) : error ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex-grow flex items-center justify-center"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="error"
          >
            <p
              className={classNames(
                'p-4 rounded-md box-border font-semibold text-center',
                'w-full max-w-xl',
                'md:p-3 md:text-sm',
                'text-[var(--color-primary-red-hover)] bg-[var(--color-error-background)] border border-[var(--color-error-border-light)]'
              )}
            >
              Error: {error}
            </p>
          </motion.div>
        ) : pokemonItems.length === 0 ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex-grow flex items-center justify-center"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="empty"
          >
            <p
              className={classNames(
                'p-4 rounded-md text-gray-800 text-center box-border',
                'w-full max-w-xl',
                'md:p-2.5 md:text-sm',
                'bg-theme-secondary border border-theme text-theme-primary'
              )}
            >
              {message}
            </p>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex-grow"
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

      <div className="flex-shrink-0 mt-auto">
        {(showPagination || isLoading) && (
          <div
            className={classNames(
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
