import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { SearchProps } from '@types';

import { cn } from '@utils/cn';

import Button from './Button';

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
    <div
      className={cn(
        'flex gap-2.5 justify-center items-center p-[15px]',
        'rounded-lg',
        'shadow-sm shadow-[hsla(0,0%,0%,0.05)]',
        'w-full max-w-2xl',
        'bg-theme-secondary-alt'
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        className={cn(
          'px-[15px] py-[10px] border rounded-md',
          'text-base flex-grow max-w-full outline-none',
          'transition-all duration-200 ease-in-out',
          'focus:border-[var(--color-primary-cyan)] focus:shadow-[0_0_0_3px_hsla(187,100%,42%,0.2)]',
          'bg-theme-primary text-theme-primary border-theme-input placeholder-theme-input-placeholder'
        )}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Search for Pokemons..."
        type="text"
        value={inputValue}
      />
      <Button
        className={cn(`px-5 py-[10px] rounded-md text-base normal-case
          shadow-sm shadow-black/10
          hover:-translate-y-[1px]
          active:shadow-black/10`)}
        color="green"
        onClick={handleSearchClick}
      >
        Search
      </Button>
    </div>
  );
};

export default Search;
