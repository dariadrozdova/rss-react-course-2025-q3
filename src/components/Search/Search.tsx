import type { SearchProps } from '@types';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './Search.module.css';

const Search = ({ initialSearchTerm, onSearch }: SearchProps) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);

  const previousInitialSearchTermReference = useRef(initialSearchTerm);

  useEffect(() => {
    const previousInitialSearchTerm =
      previousInitialSearchTermReference.current;

    const hasInitialSearchTermChanged =
      previousInitialSearchTerm !== initialSearchTerm;

    const initialSearchTermDiffersFromInput = initialSearchTerm !== inputValue;

    if (hasInitialSearchTermChanged && initialSearchTermDiffersFromInput) {
      setInputValue(initialSearchTerm);
    }

    previousInitialSearchTermReference.current = initialSearchTerm;
  }, [initialSearchTerm, inputValue]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = () => {
    const trimmedSearchTerm = inputValue.trim();
    onSearch(trimmedSearchTerm);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Search for Pokemons..."
        type="text"
        value={inputValue}
      />
      <button className={styles.searchButton} onClick={handleSearchClick}>
        Search
      </button>
    </div>
  );
};

export default Search;
