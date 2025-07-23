import { useCallback, useState } from 'react';

import CardList from '@components/CardList';
import Loader from '@components/Loader';
import Search from '@components/Search';
import useLocalStorage from '@hooks/useLocalStorage';
import { usePokemonData } from '@hooks/usePokemonData';

import styles from './MainPage.module.css';

function MainPage() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(
    'lastSearchTerm',
    ''
  );

  const { error, isLoading, pokemonItems } = usePokemonData(searchTerm);

  const [throwError, setThrowError] = useState<boolean>(false);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
    },
    [setSearchTerm]
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
