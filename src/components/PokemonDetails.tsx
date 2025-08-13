import { useOutletContext, useParams } from 'react-router-dom';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { X } from 'lucide-react';

import PokemonDetailsContent from './PokemonDetailsContent';

import { useLoaderTimeout } from '@/hooks/useLoaderTimeout';
import { usePokemonDetails } from '@/hooks/usePokemonDetails';
import { cn } from '@/utils/cn';

const MIN_CONTAINER_HEIGHT = 'min-h-[600px]';

const PokemonContainer = ({
  children,
  onClose,
  title = 'Loading...',
  titleClassName = 'text-xl font-bold',
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  titleClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'rounded-lg shadow-md p-6',
        MIN_CONTAINER_HEIGHT,
        'bg-theme-secondary'
      )}
    >
      <div className={cn('flex justify-between items-center mb-4')}>
        <h2 className={cn(titleClassName, 'text-theme-primary')}>{title}</h2>
        <button
          className={cn('p-2 rounded text-theme-secondary')}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  );
};

interface OutletContext {
  handleCloseDetails: () => void;
}

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

function PokemonDetails() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const { handleCloseDetails } = useOutletContext<OutletContext>();
  const { error, isLoading, pokemon } = usePokemonDetails(detailsId);
  const showLoader = useLoaderTimeout(detailsId);

  if (isLoading || showLoader) {
    return (
      <PokemonContainer onClose={handleCloseDetails}>
        <div className={cn('flex justify-center items-center py-8')}>
          <div
            className={cn(
              'border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin'
            )}
          />
        </div>
      </PokemonContainer>
    );
  }

  if (error) {
    let errorMessage = 'An unknown error occurred.';

    if (isFetchBaseQueryError(error)) {
      errorMessage = `Failed to fetch data: ${error.status}`;
    } else if ('message' in error && typeof error.message === 'string') {
      errorMessage = `Error: ${error.message}`;
    }

    return (
      <PokemonContainer
        onClose={handleCloseDetails}
        title="Error"
        titleClassName={cn('text-xl font-bold text-red-600')}
      >
        <div className={cn('text-center py-8')}>
          <p className={cn('text-red-600 mb-4')}>{errorMessage}</p>
          <button
            className={cn('px-4 py-2 bg-blue-600 text-white rounded')}
            onClick={handleCloseDetails}
          >
            Go Back
          </button>
        </div>
      </PokemonContainer>
    );
  }

  if (!pokemon) {
    return (
      <PokemonContainer onClose={handleCloseDetails} title="Not Found">
        <div className={cn('text-center py-8')}>
          <p className={cn('text-theme-secondary mb-4')}>Pokémon not found</p>
          <button
            className={cn('px-4 py-2 bg-blue-600 text-white rounded')}
            onClick={handleCloseDetails}
          >
            Go Back
          </button>
        </div>
      </PokemonContainer>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-md p-6 min-h-[600px] bg-theme-secondary`}
    >
      <div className={cn('flex justify-between items-center mb-6')}>
        <h2 className={cn('text-2xl font-bold capitalize text-theme-primary')}>
          {pokemon.name}
        </h2>
        <button
          className={cn('p-2 rounded cursor-pointer text-theme-secondary')}
          onClick={handleCloseDetails}
        >
          <X size={20} />
        </button>
      </div>

      <PokemonDetailsContent pokemon={pokemon} />
    </div>
  );
}

export default PokemonDetails;
