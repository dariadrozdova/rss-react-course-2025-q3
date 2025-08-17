'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import { classNames } from '@/utils/classNames';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme, isLoaded] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    document.documentElement.className = theme as Theme;
    document.documentElement.dataset.theme = theme as Theme;
    document.documentElement.style.colorScheme = theme as Theme;
  }, [theme, isLoaded]);

  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const isDark = theme === 'dark';

  const contextValue = {
    isDark,
    theme: theme as Theme,
    toggleTheme,
  };

  if (!isLoaded) {
    return (
      <ThemeContext.Provider value={contextValue}>
        <div
          className={classNames(
            'invisible absolute inset-0 w-full min-h-screen opacity-0'
          )}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={classNames(
          'opacity-100 transition-opacity duration-100 ease-in-out'
        )}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
