import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import useLocalStorage from './useLocalStorage';

interface UsePaginationAndSearchResult {
  currentPage: number;
  effectiveSearchTerm: string;
  handlePageChange: (page: number) => void;
  handleSearch: (newSearchTerm: string) => void;
}

export const usePaginationAndSearch = (): UsePaginationAndSearchResult => {
  const [searchParameters, setSearchParameters] = useSearchParams();

  const [localSearchTerm, setLocalSearchTerm] = useLocalStorage<string>(
    'lastSearchTerm',
    ''
  );

  const searchTermFromUrl = searchParameters.get('search') || '';

  const effectiveSearchTerm = searchParameters.has('search')
    ? searchTermFromUrl
    : '';

  const currentPageFromUrl = Number.parseInt(
    searchParameters.get('page') || '1',
    10
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Math.max(1, currentPageFromUrl)
  );

  useEffect(() => {
    if (searchParameters.has('search')) {
      if (searchTermFromUrl !== localSearchTerm) {
        setLocalSearchTerm(searchTermFromUrl);
      }
    } else {
      if (localSearchTerm) {
        setLocalSearchTerm('');
      }
    }
  }, [
    searchTermFromUrl,
    localSearchTerm,
    setLocalSearchTerm,
    searchParameters,
  ]);

  useEffect(() => {
    if (Math.max(1, currentPageFromUrl) !== currentPage) {
      setCurrentPage(Math.max(1, currentPageFromUrl));
    }
  }, [currentPageFromUrl, currentPage]);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setCurrentPage(1);
      setLocalSearchTerm(newSearchTerm);

      const newSearchParameters = new URLSearchParams();
      if (newSearchTerm.trim()) {
        newSearchParameters.set('search', newSearchTerm.trim());
        newSearchParameters.set('page', '1');
      } else {
        newSearchParameters.set('page', '1');
      }
      setSearchParameters(newSearchParameters);
    },
    [setLocalSearchTerm, setSearchParameters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      const newSearchParameters = new URLSearchParams(
        searchParameters.toString()
      );
      newSearchParameters.set('page', String(page));
      setSearchParameters(newSearchParameters);
    },
    [searchParameters, setSearchParameters]
  );

  return {
    currentPage,
    effectiveSearchTerm,
    handlePageChange,
    handleSearch,
  };
};
