import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type Theme = 'dark' | 'light';

interface ThemeState {
  currentTheme: Theme;
}

const initialState: ThemeState = {
  currentTheme: 'light',
};

const themeSlice = createSlice({
  initialState,
  name: 'theme',
  reducers: {
    initializeTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
    },
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { initializeTheme, setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
