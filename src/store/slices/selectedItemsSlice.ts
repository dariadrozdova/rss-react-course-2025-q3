import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { PokemonItem } from '@/types/';

interface SelectedItemsState {
  items: PokemonItem[];
}

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  initialState,
  name: 'selectedItems',
  reducers: {
    setSelectedItems: (state, action: PayloadAction<PokemonItem[]>) => {
      state.items = action.payload;
    },
    toggleItemSelection: (state, action: PayloadAction<PokemonItem>) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );

      if (existingIndex === -1) {
        state.items.push(item);
      } else {
        state.items.splice(existingIndex, 1);
      }
    },
    unselectAllItems: (state) => {
      state.items = [];
    },
  },
});

export const { setSelectedItems, toggleItemSelection, unselectAllItems } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
