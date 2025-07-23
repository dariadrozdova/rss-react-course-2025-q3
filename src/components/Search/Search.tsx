import type { SearchProps } from '@types';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

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
      className="
        flex gap-2.5 justify-center items-center p-[15px]
        bg-[hsl(190,100%,94%)] rounded-lg
        shadow-sm shadow-[hsla(0,0%,0%,0.05)]
        w-full max-w-[700px]
      "
    >
      <input
        className="
          px-[15px] py-[10px] border border-[hsl(187,70%,82%)] rounded-md
          text-base flex-grow max-w-full outline-none
          transition-all duration-200 ease-in-out
          focus:border-[hsl(187,100%,42%)] focus:shadow-[0_0_0_3px_hsla(187,100%,42%,0.2)]
        "
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Search for Pokemons..."
        type="text"
        value={inputValue}
      />
      <button
        className="
          px-5 py-[10px]
          bg-[hsl(173,100%,23%)] text-[hsl(0,0%,100%)]
          border-none rounded-md text-base cursor-pointer
          transition-all duration-200 ease-in-out transform-gpu
          shadow-sm shadow-[hsla(0,0%,0%,0.1)]
          hover:bg-[hsl(173,100%,15%)] hover:-translate-y-[1px]
          active:translate-y-0 active:shadow-xs active:shadow-[hsla(0,0%,0%,0.1)]
        "
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
