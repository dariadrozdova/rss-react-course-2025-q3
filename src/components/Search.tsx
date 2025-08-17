'use client';

import { useTranslations } from 'next-intl';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import Button from './Button';

import type { SearchProps } from '@/types/';

import { classNames } from '@/utils/classNames';

const Search = ({ initialSearchTerm, onSearch }: SearchProps) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);

  const t = useTranslations('Search');

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
      className={classNames(
        'flex gap-3 justify-center items-center p-4',
        'rounded-lg',
        'shadow-sm shadow-[hsla(0,0%,0%,0.05)]',
        'w-full max-w-2xl'
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        className={classNames(
          'px-4 py-3 border rounded-md',
          'text-base flex-grow max-w-full outline-none',
          'transition-all duration-200 ease-in-out',
          'focus:border-[var(--color-primary-cyan)] focus:shadow-[0_0_0_3px_hsla(187,100%,42%,0.2)]',
          'bg-theme-primary text-theme-primary'
        )}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={t('placeholder')}
        type="text"
        value={inputValue}
      />
      <Button
        className={classNames(
          'px-5 py-3 rounded-md text-base normal-case shadow-sm',
          'shadow-black/10',
          'hover:-translate-y-px',
          'active:shadow-black/10'
        )}
        color="green"
        onClick={handleSearchClick}
      >
        {t('button')}
      </Button>
    </div>
  );
};

export default Search;
