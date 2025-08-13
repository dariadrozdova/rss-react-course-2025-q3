import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';

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
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(
    'theme',
    'light'
  );
  const [theme, setTheme] = useState<Theme>(storedTheme);

  useEffect(() => {
    setStoredTheme(theme);
  }, [theme, setStoredTheme]);

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const isDark = theme === 'dark';

  const contextValue = {
    isDark,
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
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
