import { useState, useEffect, useCallback } from 'react';
import styles from './MainPage.module.css';
import type { PokemonItem } from '../../types/types';
import Search from '../../components/Search/Search';
import CardList from '../../components/CardList/CardList';
import Loader from '../../components/Loader/Loader';
import useLocalStorage from '../../hooks/useLocalStorage';

function MainPage() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(
    'lastSearchTerm',
    ''
  );

  const [pokemonItems, setPokemonItems] = useState<PokemonItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [throwError, setThrowError] = useState<boolean>(false);

  const _handleHttpResponse = useCallback(
    async (response: Response): Promise<Response> => {
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
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
              name: item.name,
              url: item.url,
              imageUrl: detailData.sprites.front_default,
              id: detailData.id,
            };
          })
        );

        setPokemonItems(itemsWithDetails);
        setSearchTerm(query);
      } catch (err) {
        console.error('Error fetching Pokemon:', err);
        setError(
          err instanceof Error
            ? err.message
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
      await fetchPokemonItems(searchTerm).catch((err) =>
        console.error('Error during search fetch:', err)
      );
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

      <button onClick={triggerErrorState} className={styles.errorTestButton}>
        Throw Test Error
      </button>
    </div>
  );
}

export default MainPage;
