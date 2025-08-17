'use client';

import { useCallback, useEffect, useState } from 'react';

type UseLocalStorageResult<T> = [
  T | undefined,
  (value: ((previous: T | undefined) => T) | T) => void,
  boolean,
];

function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        setStoredValue(parsed);
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    } finally {
      setIsLoaded(true);
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: ((previous: T | undefined) => T) | T) => {
      try {
        const newValue =
          typeof value === 'function'
            ? (value as (previous: T | undefined) => T)(storedValue)
            : value;

        setStoredValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoaded];
}

export default useLocalStorage;
