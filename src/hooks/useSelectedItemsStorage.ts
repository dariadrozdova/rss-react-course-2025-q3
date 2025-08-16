'use client';

import { useEffect } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedItems } from '@/store/selectors';
import { setSelectedItems } from '@/store/slices/selectedItemsSlice';
import type { PokemonItem } from '@/types/';

export const useSelectedItemsStorage = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);
  const [storedItems, setStoredItems] = useLocalStorage<string>(
    'pokemonSelectedItems',
    '[]'
  );

  useEffect(() => {
    try {
      const parsedItems: PokemonItem[] = JSON.parse(storedItems);
      if (parsedItems.length > 0) {
        dispatch(setSelectedItems(parsedItems));
      }
    } catch (error) {
      console.warn('Failed to parse stored selected items:', error);
    }
  }, [dispatch, storedItems]);

  useEffect(() => {
    setStoredItems(JSON.stringify(selectedItems));
  }, [selectedItems, setStoredItems]);
};
