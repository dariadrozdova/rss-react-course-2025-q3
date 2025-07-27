import React, { useEffect } from 'react';

import useLocalStorage from '@hooks/useLocalStorage';

import { selectTheme } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Theme } from '@/store/slices/themeSlice';
import { initializeTheme } from '@/store/slices/themeSlice';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const themeState = useAppSelector(selectTheme);
  const currentTheme = themeState.currentTheme;
  const [localTheme, setLocalTheme] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    dispatch(initializeTheme(localTheme));
  }, [dispatch, localTheme]);

  useEffect(() => {
    if (currentTheme !== localTheme) {
      setLocalTheme(currentTheme);
    }
  }, [currentTheme, localTheme, setLocalTheme]);

  useEffect(() => {
    document.documentElement.className = currentTheme;
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
