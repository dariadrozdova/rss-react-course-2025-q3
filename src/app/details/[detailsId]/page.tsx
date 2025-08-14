'use client';

import { X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import PokemonDetailsContent from '@/components/PokemonDetailsContent';
import { useLoaderTimeout } from '@/hooks/useLoaderTimeout';
import { usePokemonDetails } from '@/hooks/usePokemonDetails';
import { cn } from '@/utils/cn';

const MIN_CONTAINER_HEIGHT = 'min-h-[600px]'; // TODO

export default function PokemonDetailsPage() {
  const parameters = useParams();
  const router = useRouter();

  const detailsId = parameters.detailsId as string;
  const { error, isLoading, pokemon } = usePokemonDetails(detailsId);
  const showLoader = useLoaderTimeout(detailsId);

  const handleCloseDetails = () => {
    router.back();
  };

  if (isLoading || showLoader) {
    return (
      <div
        className={cn(
          'rounded-lg shadow-md p-6',
          MIN_CONTAINER_HEIGHT,
          'bg-theme-secondary'
        )}
      >
        <div className="flex justify-center items-center py-8">
          <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'rounded-lg shadow-md p-6',
          MIN_CONTAINER_HEIGHT,
          'bg-theme-secondary'
        )}
      >
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="text-red-600 mb-4">
          {typeof error === 'object' && 'status' in error
            ? `Failed to fetch data: ${error.status}`
            : 'An unknown error occurred.'}
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleCloseDetails}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div
        className={cn(
          'rounded-lg shadow-md p-6',
          MIN_CONTAINER_HEIGHT,
          'bg-theme-secondary'
        )}
      >
        <h2 className="text-xl font-bold">Not Found</h2>
        <p className="text-theme-secondary mb-4">Pokémon not found</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleCloseDetails}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg shadow-md p-6',
        MIN_CONTAINER_HEIGHT,
        'bg-theme-secondary'
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize text-theme-primary">
          {pokemon.name}
        </h2>
        <button
          className="p-2 rounded cursor-pointer text-theme-secondary"
          onClick={handleCloseDetails}
        >
          <X size={20} />
        </button>
      </div>
      <PokemonDetailsContent pokemon={pokemon} />
    </div>
  );
}
