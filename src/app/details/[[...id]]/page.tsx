'use client';

import { Suspense } from 'react';

import { X } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import MainContent from '@/components/MainContent';
import PokemonDetailsContent from '@/components/PokemonDetailsContent';
import { useLoaderTimeout } from '@/hooks/useLoaderTimeout';
import { usePokemonDetails } from '@/hooks/usePokemonDetails';
import { cn } from '@/utils/cn';

const MIN_CONTAINER_HEIGHT = 'min-h-[600px]';

export default function PokemonPage() {
  const parameters = useParams<{ id?: string[] }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pokemonId = parameters?.id?.[0] ?? null;

  const handleCloseDetails = () => {
    const query = searchParams.toString();
    router.push(`/details${query ? `?${query}` : ''}`);
  };

  return (
    <div
      className={cn(
        'grid gap-4',
        pokemonId ? 'md:grid-cols-3' : 'md:grid-cols-1'
      )}
    >
      <div className={cn(pokemonId ? 'md:col-span-2' : 'md:col-span-1')}>
        <Suspense fallback={<div>Loading list...</div>}>
          <MainContent />
        </Suspense>
      </div>

      {pokemonId && (
        <DetailsPanel onClose={handleCloseDetails} pokemonId={pokemonId} />
      )}
    </div>
  );
}

function DetailsPanel({
  onClose,
  pokemonId,
}: {
  onClose: () => void;
  pokemonId: string;
}) {
  const { error, isLoading, pokemon } = usePokemonDetails(pokemonId);
  const showLoader = useLoaderTimeout(pokemonId);

  if (isLoading || showLoader) {
    return (
      <div
        className={cn(
          'rounded-lg shadow-md p-6 bg-theme-secondary md:col-span-1',
          MIN_CONTAINER_HEIGHT
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
          'rounded-lg shadow-md p-6 bg-theme-secondary md:col-span-1',
          MIN_CONTAINER_HEIGHT
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
          onClick={onClose}
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
          'rounded-lg shadow-md p-6 bg-theme-secondary md:col-span-1',
          MIN_CONTAINER_HEIGHT
        )}
      >
        <h2 className="text-xl font-bold">Not Found</h2>
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
    <div
      className={cn(
        'rounded-lg shadow-md p-6 bg-theme-secondary md:col-span-1',
        MIN_CONTAINER_HEIGHT
      )}
    >
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
