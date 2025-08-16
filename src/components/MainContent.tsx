'use client';

import { useEffect, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { PokemonContent } from '@/components/PokemonContent';
import Search from '@/components/Search';
import SelectionFlyout from '@/components/SelectionFlyout';
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearch';
import { useAppSelector } from '@/store/hooks';
import { selectHasSelectedItems } from '@/store/selectors';
import type { PokemonItem } from '@/types';
import { cn } from '@/utils/classNames';

const ITEMS_PER_PAGE = 20;

interface MainContentProps {
  pokemonList: PokemonItem[];
  selectedPokemonId?: string;
  totalCount: number;
}

export default function MainContent({
  pokemonList,
  selectedPokemonId,
}: MainContentProps) {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const hasSelectedItems = useAppSelector(selectHasSelectedItems);

  const {
    currentPage,
    effectiveSearchTerm,
    handlePageChange,
    handleSearch,
    isValidPage,
  } = usePaginationAndSearch();

  const { pokemonItems, totalItems } = useMemo(() => {
    const filtered = effectiveSearchTerm
      ? pokemonList.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
        )
      : pokemonList;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      pokemonItems: paginated,
      totalItems: filtered.length,
    };
  }, [pokemonList, effectiveSearchTerm, currentPage]);

  const totalPages = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  useEffect(() => {
    if (!(isValidPage && (totalPages === 0 || currentPage <= totalPages))) {
      router.push('/not-found');
    }
  }, [searchParameters, totalPages]);

  const handlePokemonClick = (pokemonId: number) => {
    if (parsedPokemonId === pokemonId) {
      return;
    }
    const query = searchParameters.toString();
    router.push(`/details/${pokemonId}${query ? `?${query}` : ''}`, {
      scroll: false,
    });
  };

  const parsedPokemonId = selectedPokemonId
    ? Number.parseInt(selectedPokemonId, 10)
    : undefined;

  return (
    <>
      <div
        className={cn(
          'flex flex-row gap-8 w-full transition-all duration-300',
          hasSelectedItems && 'pb-20'
        )}
      >
        <div className="flex flex-col gap-5 w-full transition-all duration-300">
          <section className="theme-card p-6 rounded-lg shadow-md text-center flex flex-col items-center gap-5 box-border w-full flex-shrink-0">
            <Search
              initialSearchTerm={effectiveSearchTerm}
              onSearch={handleSearch}
            />
          </section>

          <section className="flex-grow theme-card p-6 rounded-lg shadow-md flex flex-col items-center justify-start box-border w-full min-h-[900px]">
            <PokemonContent
              currentPage={currentPage}
              effectiveSearchTerm={effectiveSearchTerm}
              error={null}
              isLoading={false}
              onPageChange={handlePageChange}
              onPokemonClick={handlePokemonClick}
              pokemonItems={pokemonItems}
              selectedPokemonId={parsedPokemonId}
              totalItems={totalItems}
              totalPages={totalPages}
            />
          </section>
        </div>
      </div>
      <SelectionFlyout />
    </>
  );
}
