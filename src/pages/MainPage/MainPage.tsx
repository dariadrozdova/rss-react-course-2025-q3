import { useCallback, useEffect, useState } from 'react';

import CardList from '../../components/CardList/CardList';
import Loader from '../../components/Loader/Loader';
import Search from '../../components/Search/Search';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { PokemonItem } from '../../types/types';

import styles from './MainPage.module.css';

function MainPage() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(
    'lastSearchTerm',
    ''
  );

  const [pokemonItems, setPokemonItems] = useState<PokemonItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [throwError, setThrowError] = useState<boolean>(false);

  const _handleHttpResponse = useCallback(
    async (response: Response): Promise<Response> => {
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (error_) {
          console.warn('Failed to parse error response:', error_);
        }
        throw new Error(errorMessage);
      }
      return response;
    },
    []
  );

  const fetchPokemonItems = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);
      setPokemonItems([]);

      const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
      const limit = 20;
      const offset = 0;

      const url = `${baseUrl}?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url);
        const validatedResponse = await _handleHttpResponse(response);
        const data = await validatedResponse.json();

        let filteredItems = data.results;

        if (query) {
          const lowerCaseQuery = query.toLowerCase();
          filteredItems = data.results.filter(
            (item: { name: string; url: string }) =>
              item.name.toLowerCase().includes(lowerCaseQuery)
          );
        }

        if (filteredItems.length === 0) {
          setSearchTerm(query);
          setIsLoading(false);
          return;
        }

        const itemsWithDetails: PokemonItem[] = await Promise.all(
          filteredItems.map(async (item: { name: string; url: string }) => {
            const detailResponse = await fetch(item.url);
            const verifiedResponse = await _handleHttpResponse(detailResponse);
            const detailData = await verifiedResponse.json();

            return {
              id: detailData.id,
              imageUrl: detailData.sprites.front_default,
              name: item.name,
              url: item.url,
            };
          })
        );

        setPokemonItems(itemsWithDetails);
        setSearchTerm(query);
      } catch (error_) {
        console.warn('Error fetching Pokemon:', error_);
        setError(
          error_ instanceof Error
            ? error_.message
            : 'An unknown error occurred while fetching Pokemon.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [_handleHttpResponse, setSearchTerm]
  );

  useEffect(() => {
    const runSearch = async () => {
      await fetchPokemonItems(searchTerm).catch((error_) => {
        console.warn('Error during search fetch:', error_);
      });
    };
    void runSearch();
  }, [searchTerm, fetchPokemonItems]);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      if (newSearchTerm !== searchTerm) {
        fetchPokemonItems(newSearchTerm);
      }
    },
    [searchTerm, fetchPokemonItems]
  );

  const triggerErrorState = useCallback(() => {
    setThrowError(true);
  }, []);

  if (throwError) {
    throw new Error('This is a test error thrown from the render method!');
  }

  return (
    <div className={styles.mainPageContainer}>
      <section className={styles.topSection}>
        <Search initialSearchTerm={searchTerm} onSearch={handleSearch} />
      </section>

      <section className={styles.resultsSection}>
        {isLoading && <Loader />}

        {error && <p className={styles.errorMessage}>Error: {error}</p>}

        {!isLoading && !error && pokemonItems.length === 0 && (
          <p>No Pokemon found. Try a different search!</p>
        )}

        {!isLoading && !error && pokemonItems.length > 0 && (
          <CardList pokemonItems={pokemonItems} />
        )}
      </section>

      <button className={styles.errorTestButton} onClick={triggerErrorState}>
        Throw Test Error
      </button>
    </div>
  );
}

export default MainPage;
