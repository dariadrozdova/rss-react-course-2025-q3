import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useLocalStorage from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  let localStorageMock: {
    clear: ReturnType<typeof vi.fn>;
    getItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
  };
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  const originalLocalStorage = window.localStorage;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    const store = new Map<string, string>();
    localStorageMock = {
      clear: vi.fn(() => {
        store.clear();
      }),
      getItem: vi.fn((key: string) => store.get(key) || null),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
      }),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
    };

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
    console.warn = originalConsoleWarn;
    vi.restoreAllMocks();
  });

  it('should initialize with initialValue if nothing in localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', 'initial' as string)
    );

    expect(result.current[0]).toBe('initial');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should initialize with value from localStorage if present', () => {
    localStorageMock.getItem.mockReturnValueOnce('storedValue');
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', 'initial' as string)
    );

    expect(result.current[0]).toBe('storedValue');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should initialize with initialValue from function if nothing in localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', () => 'initialFromFunction' as string)
    );

    expect(result.current[0]).toBe('initialFromFunction');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', 'initial' as string)
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      'newValue'
    );
  });

  it('should update localStorage when setValue is called with a function', () => {
    localStorageMock.getItem.mockReturnValueOnce('initial');
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', 'initial' as string)
    );

    act(() => {
      result.current[1]((previous) => `${previous}Updated`);
    });

    expect(result.current[0]).toBe('initialUpdated');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      'initialUpdated'
    );
  });

  it('should log a warning if reading from localStorage fails', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage read error');
    });
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', 'initial' as string)
    );

    expect(result.current[0]).toBe('initial');
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "testKey":',
      expect.any(Error)
    );
  });

  it('should log a warning if writing to localStorage fails', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>('testKey', 'initial' as string)
    );

    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage write error');
    });

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      'newValue'
    );
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error writing to localStorage key "testKey":',
      expect.any(Error)
    );
  });
});
