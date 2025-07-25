import type {
  PokemonItem,
  PokemonListItem,
  UsePokemonDataResult,
} from '@types';
import { useEffect, useMemo, useState } from 'react';

import { fetchPokemonDetails, fetchPokemonList } from '@api/pokemonApi';

export const usePokemonData = (
  searchTerm: string,
  page: number,
  limit: number
): UsePokemonDataResult => {
  const [allPokemonListItems, setAllPokemonListItems] = useState<
    PokemonListItem[]
  >([]);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(true);
  const [isLoadingPageDetails, setIsLoadingPageDetails] =
    useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [currentPagePokemonDetails, setCurrentPagePokemonDetails] = useState<
    PokemonItem[]
  >([]);

  useEffect(() => {
    const loadAllPokemon = async () => {
      setIsLoadingAll(true);
      setError(null);

      try {
        const initialResponse = await fetchPokemonList(0, 1);
        const totalCount = initialResponse.total;

        let fetchedResults: PokemonListItem[] = [];
        let currentOffset = 0;
        const batchLimit = 1000;

        while (currentOffset < totalCount) {
          const { results } = await fetchPokemonList(currentOffset, batchLimit);
          fetchedResults = [...fetchedResults, ...results];
          currentOffset += batchLimit;
        }

        setAllPokemonListItems(fetchedResults);
      } catch (error_) {
        if (error_ instanceof Error) {
          setError(error_.message || 'Failed to load all Pokemon');
        }
        setAllPokemonListItems([]);
      } finally {
        setIsLoadingAll(false);
      }
    };

    loadAllPokemon();
  }, []);

  const filteredPokemonListItems = useMemo(() => {
    if (!searchTerm) {
      return allPokemonListItems;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allPokemonListItems.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allPokemonListItems, searchTerm]);

  const totalFilteredItems = filteredPokemonListItems.length;

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pokemonToFetchDetailsFor = filteredPokemonListItems.slice(
      startIndex,
      endIndex
    );

    const loadDetailsForCurrentPage = async () => {
      setIsLoadingPageDetails(true);
      setError(null);

      if (pokemonToFetchDetailsFor.length === 0) {
        setCurrentPagePokemonDetails([]);
        setIsLoadingPageDetails(false);
        return;
      }

      try {
        const detailsPromises = pokemonToFetchDetailsFor.map((item) =>
          fetchPokemonDetails(item.url)
        );
        const fetchedDetails = await Promise.all(detailsPromises);
        setCurrentPagePokemonDetails(fetchedDetails);
      } catch (error_) {
        if (error_ instanceof Error) {
          setError(
            error_.message || 'Failed to load details for current page.'
          );
        } else {
          setError(
            String(error_) || 'Failed to load details for current page.'
          );
        }
        setCurrentPagePokemonDetails([]);
      } finally {
        setIsLoadingPageDetails(false);
      }
    };

    if (!isLoadingAll) {
      loadDetailsForCurrentPage();
    }
  }, [filteredPokemonListItems, page, limit, isLoadingAll, searchTerm]);

  const overallLoading = isLoadingAll || isLoadingPageDetails;

  return {
    error,
    isLoading: overallLoading,
    pokemonItems: currentPagePokemonDetails,
    totalItems: totalFilteredItems,
  };
};
