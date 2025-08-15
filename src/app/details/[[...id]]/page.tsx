'use client';

import { Suspense } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import DetailsPanel from '@/components/DetailsPanel';
import MainContent from '@/components/MainContent';
import { cn } from '@/utils/cn';

export default function PokemonPage() {
  const parameters = useParams<{ id?: string[] }>();
  const router = useRouter();
  const searchParameters = useSearchParams();

  const pokemonId = parameters?.id?.[0];

  const handleCloseDetails = () => {
    const query = searchParameters.toString();
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
          <MainContent selectedPokemonId={pokemonId} />
        </Suspense>
      </div>

      {pokemonId && (
        <DetailsPanel onClose={handleCloseDetails} pokemonId={pokemonId} />
      )}
    </div>
  );
}
