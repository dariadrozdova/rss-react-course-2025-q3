import { configureStore } from '@reduxjs/toolkit';

import selectedItemsSlice from './slices/selectedItemsSlice';

import { pokemonApi } from '@/api/pokemonApiSlice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    selectedItems: selectedItemsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
