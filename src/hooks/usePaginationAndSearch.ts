'use client';

import { useCallback, useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useLocalStorage from './useLocalStorage';

interface UsePaginationAndSearchResult {
  currentPage: number;
  effectiveSearchTerm: string;
  handlePageChange: (page: number) => void;
  handleSearch: (newSearchTerm: string) => void;
  isValidPage: boolean;
}

export const usePaginationAndSearch = (): UsePaginationAndSearchResult => {
  const searchParameters = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [localSearchTerm, setLocalSearchTerm] = useLocalStorage<string>(
    'lastSearchTerm',
    ''
  );

  const searchTermFromUrl = searchParameters.get('search') || '';
  const effectiveSearchTerm = searchParameters.has('search')
    ? searchTermFromUrl
    : '';

  const pageParameter = searchParameters.get('page') || '1';
  const currentPageFromUrl = Number.parseInt(pageParameter, 10);

  const isValidPageParameter = () => {
    if (pageParameter === '1' && !searchParameters.has('page')) {
      return true;
    }

    const parsed = Number.parseInt(pageParameter, 10);
    return (
      !Number.isNaN(parsed) && parsed >= 1 && pageParameter === String(parsed)
    );
  };

  const isValidPage = isValidPageParameter();

  const [currentPage, setCurrentPage] = useState<number>(
    isValidPage ? Math.max(1, currentPageFromUrl) : 1
  );

  const updateSearchParams = (parameters: URLSearchParams) => {
    router.push(`${pathname}?${parameters.toString()}`);
  };

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
    if (isValidPage) {
      const validPage = Math.max(1, currentPageFromUrl);
      if (validPage !== currentPage) {
        setCurrentPage(validPage);
      }
    }
  }, [currentPageFromUrl, currentPage, isValidPage]);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setCurrentPage(1);
      setLocalSearchTerm(newSearchTerm);

      const newSearchParameters = new URLSearchParams();
      if (newSearchTerm.trim()) {
        newSearchParameters.set('search', newSearchTerm.trim());
      }
      newSearchParameters.set('page', '1');

      updateSearchParams(newSearchParameters);
    },
    [setLocalSearchTerm]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      const newSearchParameters = new URLSearchParams(
        searchParameters.toString()
      );
      newSearchParameters.set('page', String(page));

      updateSearchParams(newSearchParameters);
    },
    [searchParameters]
  );

  return {
    currentPage,
    effectiveSearchTerm,
    handlePageChange,
    handleSearch,
    isValidPage,
  };
};
