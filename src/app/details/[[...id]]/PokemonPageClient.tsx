'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import DetailsPanel from '@/components/DetailsPanel';
import MainContent from '@/components/MainContent';
import type { PokemonItem } from '@/types';
import { cn } from '@/utils/classNames';

interface PokemonPageClientProps {
  pokemonList: PokemonItem[];
  totalCount: number;
}

export default function PokemonPageClient({
  pokemonList,
  totalCount,
}: PokemonPageClientProps) {
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
        <MainContent
          pokemonList={pokemonList}
          selectedPokemonId={pokemonId}
          totalCount={totalCount}
        />
      </div>

      {pokemonId && (
        <DetailsPanel onClose={handleCloseDetails} pokemonId={pokemonId} />
      )}
    </div>
  );
}
