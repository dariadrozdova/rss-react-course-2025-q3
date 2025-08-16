'use client';

import React from 'react';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@/context/ThemeContext';
import type { AppStore } from '@/store';

export function Providers({
  children,
  store,
}: {
  children: React.ReactNode;
  store: AppStore;
}) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
