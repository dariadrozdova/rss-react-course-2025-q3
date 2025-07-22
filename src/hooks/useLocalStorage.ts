import { useCallback, useState } from 'react';

type UseLocalStorageResult<T> = [T, (value: ((previous: T) => T) | T) => void];

function useLocalStorage<T extends string>(
  key: string,
  initialValue: (() => T) | T
): UseLocalStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item === null
        ? typeof initialValue === 'function'
          ? initialValue()
          : initialValue
        : (item as T);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  const setValue = useCallback(
    (value: ((previous: T) => T) | T) => {
      try {
        setStoredValue((previousValue) => {
          const valueToStore =
            typeof value === 'function' ? value(previousValue) : value;
          localStorage.setItem(key, String(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
