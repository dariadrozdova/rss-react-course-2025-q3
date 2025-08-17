'use client';

import { useEffect, useRef } from 'react';

import type { PokemonItem } from '@/types/';

import useLocalStorage from '@/hooks/useLocalStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedItems } from '@/store/selectors';
import { setSelectedItems } from '@/store/slices/selectedItemsSlice';

export const useSelectedItemsStorage = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);
  const isFirstLoadReference = useRef(true);

  const [storedItems, setStoredItems, isLocalStorageLoaded] =
    useLocalStorage<string>('pokemonSelectedItems', '[]');

  useEffect(() => {
    if (!isLocalStorageLoaded || !isFirstLoadReference.current) {
      return;
    }

    try {
      const parsedItems: PokemonItem[] = JSON.parse(storedItems || '[]');
      if (parsedItems.length > 0) {
        dispatch(setSelectedItems(parsedItems));
      }
    } catch (error) {
      console.warn('Failed to parse stored selected items:', error);
    } finally {
      isFirstLoadReference.current = false;
    }
  }, [dispatch, storedItems, isLocalStorageLoaded]);

  useEffect(() => {
    if (!isLocalStorageLoaded) {
      return;
    }
    setStoredItems(JSON.stringify(selectedItems));
  }, [selectedItems, setStoredItems, isLocalStorageLoaded]);
};
