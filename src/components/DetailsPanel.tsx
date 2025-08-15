'use client';

import { X } from 'lucide-react';

import PokemonDetailsContent from '@/components/PokemonDetailsContent';
import { useLoaderTimeout } from '@/hooks/useLoaderTimeout';
import { usePokemonDetails } from '@/hooks/usePokemonDetails';
import { cn } from '@/utils/cn';

const MIN_CONTAINER_HEIGHT = 'min-h-[600px]';

interface DetailsPanelProps {
  onClose: () => void;
  pokemonId: string;
}

export default function DetailsPanel({
  onClose,
  pokemonId,
}: DetailsPanelProps) {
  const { error, isLoading, pokemon } = usePokemonDetails(pokemonId);
  const showLoader = useLoaderTimeout(pokemonId);

  const mainPanelClasses = cn(
    'relative overflow-hidden theme-card rounded-lg shadow-md md:col-span-1',
    'transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg',
    'bg-theme-secondary p-6',
    MIN_CONTAINER_HEIGHT,
    'max-h-[700px] overflow-y-auto'
  );

  if (isLoading || showLoader) {
    return (
      <div className={mainPanelClasses}>
        <div className="flex justify-center items-center py-8">
          <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={mainPanelClasses}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <button
            className="p-2 rounded cursor-pointer text-theme-secondary"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-red-600 mb-4">
          {typeof error === 'object' && 'status' in error
            ? `Failed to fetch data: ${error.status}`
            : 'An unknown error occurred.'}
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onClose}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={mainPanelClasses}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Not Found</h2>
          <button
            className="p-2 rounded cursor-pointer text-theme-secondary"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-theme-secondary mb-4">Pokémon not found</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onClose}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={mainPanelClasses}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize text-theme-primary">
          {pokemon.name}
        </h2>
        <button
          className="p-2 rounded cursor-pointer text-theme-secondary"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <PokemonDetailsContent pokemon={pokemon} />
    </div>
  );
}
