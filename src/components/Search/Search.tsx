import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import styles from './Search.module.css';
import type { SearchProps } from '../../types/types';

const Search = ({ initialSearchTerm, onSearch }: SearchProps) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);

  const prevInitialSearchTermRef = useRef(initialSearchTerm);

  useEffect(() => {
    const prevInitialSearchTerm = prevInitialSearchTermRef.current;

    const hasInitialSearchTermChanged =
      prevInitialSearchTerm !== initialSearchTerm;

    const initialSearchTermDiffersFromInput = initialSearchTerm !== inputValue;

    if (hasInitialSearchTermChanged && initialSearchTermDiffersFromInput) {
      setInputValue(initialSearchTerm);
    }

    prevInitialSearchTermRef.current = initialSearchTerm;
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
        type="text"
        placeholder="Search for Pokemons..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className={styles.searchInput}
      />
      <button onClick={handleSearchClick} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
};

export default Search;
