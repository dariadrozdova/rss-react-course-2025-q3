'use client';

import { Provider } from 'react-redux';

import { ThemeProvider } from '@/context/ThemeContext';
import { store } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
