'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import type { PokemonItem } from '@/types';

import DetailsPanel from '@/components/DetailsPanel';
import MainContent from '@/components/MainContent';
import { classNames } from '@/utils/classNames';

interface PokemonPageClientProps {
  pokemonList: PokemonItem[];
  totalCount: number;
}

export default function PokemonPageClient({
  pokemonList,
  totalCount,
}: PokemonPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pokemonId = searchParams.get('id');

  const handleCloseDetails = () => {
    const parameters = new URLSearchParams(searchParams);
    parameters.delete('id');
    const queryString = parameters.toString();
    router.push(`/${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  return (
    <div
      className={classNames(
        'grid gap-4',
        pokemonId ? 'md:grid-cols-3' : 'md:grid-cols-1'
      )}
    >
      <div
        className={classNames(pokemonId ? 'md:col-span-2' : 'md:col-span-1')}
      >
        <MainContent
          pokemonList={pokemonList}
          selectedPokemonId={pokemonId ?? undefined}
          totalCount={totalCount}
        />
      </div>

      {pokemonId && (
        <DetailsPanel onClose={handleCloseDetails} pokemonId={pokemonId} />
      )}
    </div>
  );
}
