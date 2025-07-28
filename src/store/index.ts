import { configureStore } from '@reduxjs/toolkit';

import selectedItemsSlice from './slices/selectedItemsSlice';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
