import { configureStore } from '@reduxjs/toolkit';

import selectedItemsSlice from './slices/selectedItemsSlice';

export type AppDispatch = AppStore['dispatch'];
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;

export function makeStore() {
  return configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    reducer: {
      selectedItems: selectedItemsSlice,
    },
  });
}
