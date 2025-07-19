import { useState, useCallback } from 'react';

type UseLocalStorageResult<T> = [T, (value: T | ((prev: T) => T)) => void];

function useLocalStorage<T extends string>(
  key: string,
  initialValue: T | (() => T)
): UseLocalStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null
        ? (item as T)
        : initialValue instanceof Function
          ? initialValue()
          : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;
          localStorage.setItem(key, String(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
