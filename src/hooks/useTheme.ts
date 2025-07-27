import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Theme } from '@/store/slices/themeSlice';
import { setTheme, toggleTheme } from '@/store/slices/themeSlice';

interface UseThemeReturn {
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: Theme) => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const changeTheme = (theme: Theme): void => {
    dispatch(setTheme(theme));
  };

  const toggle = (): void => {
    dispatch(toggleTheme());
  };

  const isDark = currentTheme === 'dark';
  const isLight = currentTheme === 'light';

  return {
    isDark,
    isLight,
    setTheme: changeTheme,
    theme: currentTheme,
    toggleTheme: toggle,
  };
};
