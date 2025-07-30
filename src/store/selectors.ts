import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './index';

const selectSelectedItemsState = (state: RootState) => state.selectedItems;

export const selectSelectedItems = createSelector(
  [selectSelectedItemsState],
  (selectedItemsState) => selectedItemsState.items
);

export const selectSelectedItemsCount = createSelector(
  [selectSelectedItems],
  (items) => items.length
);

export const selectIsItemSelected = createSelector(
  [selectSelectedItems, (_, itemId: number) => itemId],
  (items, itemId) => items.some((item) => item.id === itemId)
);

export const selectHasSelectedItems = createSelector(
  [selectSelectedItemsCount],
  (count) => count > 0
);
