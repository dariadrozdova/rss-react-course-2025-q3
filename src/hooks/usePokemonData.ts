import { useEffect, useMemo, useState } from 'react';

import type {
  PokemonItem,
  PokemonListItem,
  UsePokemonDataResult,
} from '@types';

import { fetchPokemonDetails, fetchPokemonList } from '@api/pokemonApi';

const loadAllPokemon = async (
  setIsLoadingAll: (loading: boolean) => void,
  setError: (error: null | string) => void,
  setAllPokemonListItems: (items: PokemonListItem[]) => void
) => {
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

const loadDetailsForCurrentPage = async (
  pokemonToFetchDetailsFor: PokemonListItem[],
  setIsLoadingPageDetails: (loading: boolean) => void,
  setError: (error: null | string) => void,
  setCurrentPagePokemonDetails: (items: PokemonItem[]) => void
) => {
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

    const transformedPokemonItems: PokemonItem[] = fetchedDetails.map(
      (details, index) => ({
        id: details.id,
        imageUrl: details.sprites.front_default || undefined,
        name: details.name,
        url: pokemonToFetchDetailsFor[index].url,
      })
    );

    setCurrentPagePokemonDetails(transformedPokemonItems);
  } catch (error_) {
    if (error_ instanceof Error) {
      setError(error_.message || 'Failed to load details for current page.');
    } else {
      setError(String(error_) || 'Failed to load details for current page.');
    }
    setCurrentPagePokemonDetails([]);
  } finally {
    setIsLoadingPageDetails(false);
  }
};

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
    loadAllPokemon(setIsLoadingAll, setError, setAllPokemonListItems);
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

    if (!isLoadingAll) {
      loadDetailsForCurrentPage(
        pokemonToFetchDetailsFor,
        setIsLoadingPageDetails,
        setError,
        setCurrentPagePokemonDetails
      );
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
