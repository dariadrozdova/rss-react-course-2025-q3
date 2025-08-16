'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';

import { setupListeners } from '@reduxjs/toolkit/query';

import { ThemeProvider } from '@/context/ThemeContext';
import type { AppStore } from '@/store';
import { makeStore } from '@/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeReference = useRef<AppStore>(null);

  if (!storeReference.current) {
    storeReference.current = makeStore();
    setupListeners(storeReference.current.dispatch);
  }

  return (
    <Provider store={storeReference.current}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
