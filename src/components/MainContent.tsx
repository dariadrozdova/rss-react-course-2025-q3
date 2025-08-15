'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import CacheInvalidationButton from '@/components/CacheInvalidationButton';
import { PokemonContent } from '@/components/PokemonContent';
import Search from '@/components/Search';
import SelectionFlyout from '@/components/SelectionFlyout';
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearch';
import { usePokemonData } from '@/hooks/usePokemonData';
import { useAppSelector } from '@/store/hooks';
import { selectHasSelectedItems } from '@/store/selectors';
import { cn } from '@/utils/cn';

const ITEMS_PER_PAGE = 20;

interface MainContentProps {
  selectedPokemonId: string | undefined;
}

export default function MainContent({ selectedPokemonId }: MainContentProps) {
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

  const { error, isLoading, pokemonItems, totalItems } = usePokemonData(
    effectiveSearchTerm,
    currentPage,
    ITEMS_PER_PAGE
  );

  const totalPages = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  const isValidPageParameter = () =>
    isValidPage && (totalPages === 0 || currentPage <= totalPages);

  useEffect(() => {
    if (!isValidPageParameter()) {
      router.push('/not-found');
    }
  }, [searchParameters, totalPages]);

  const handlePokemonClick = (pokemonId: number) => {
    const query = searchParameters.toString();
    router.push(`/details/${pokemonId}${query ? `?${query}` : ''}`);
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
            <CacheInvalidationButton disabled={isLoading} />
          </section>

          <section className="flex-grow theme-card p-6 rounded-lg shadow-md flex flex-col items-center justify-start box-border w-full min-h-[900px]">
            <PokemonContent
              currentPage={currentPage}
              effectiveSearchTerm={effectiveSearchTerm}
              error={error}
              isLoading={isLoading}
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
