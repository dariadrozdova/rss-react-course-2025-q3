import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import type { PokemonItem } from '@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SelectionFlyout from '@components/SelectionFlyout';
import selectedItemsReducer from '@store/slices/selectedItemsSlice';

import { mockPokemonDetailResponses } from '@/__tests__/utils/mainPageMockData';

global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = vi.fn();

const mockItems: PokemonItem[] = [
  {
    id: mockPokemonDetailResponses.bulbasaur.id,
    imageUrl: mockPokemonDetailResponses.bulbasaur.imageUrl,
    name: mockPokemonDetailResponses.bulbasaur.name,
    url: mockPokemonDetailResponses.bulbasaur.url,
  },
  {
    id: mockPokemonDetailResponses.charmander.id,
    imageUrl: mockPokemonDetailResponses.charmander.imageUrl,
    name: mockPokemonDetailResponses.charmander.name,
    url: mockPokemonDetailResponses.charmander.url,
  },
  {
    id: mockPokemonDetailResponses.pikachu.id,
    imageUrl: mockPokemonDetailResponses.pikachu.imageUrl,
    name: mockPokemonDetailResponses.pikachu.name,
    url: mockPokemonDetailResponses.pikachu.url,
  },
];

const createMockStore = (selectedItems: PokemonItem[] = []) => {
  return configureStore({
    preloadedState: {
      selectedItems: { items: selectedItems },
    },
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
};

const renderWithStore = (selectedItems: PokemonItem[] = []) => {
  const store = createMockStore(selectedItems);
  return render(
    <Provider store={store}>
      <SelectionFlyout />
    </Provider>
  );
};

describe('SelectionFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    { description: 'no items selected', itemCount: 0 },
    { description: 'one item selected', itemCount: 1 },
    { description: 'multiple items selected', itemCount: 3 },
  ])('when $description', ({ itemCount }) => {
    it('renders correctly', () => {
      renderWithStore(mockItems.slice(0, itemCount));

      if (itemCount === 0) {
        expect(screen.queryByText(/item/)).not.toBeInTheDocument();
      } else {
        const expectedText =
          itemCount === 1 ? '1 item selected' : `${itemCount} items selected`;
        expect(screen.getByText(expectedText)).toBeInTheDocument();
        expect(screen.getByText('Unselect all')).toBeInTheDocument();
        expect(screen.getByText('Download')).toBeInTheDocument();
      }
    });
  });

  describe('functionality', () => {
    beforeEach(() => {
      renderWithStore(mockItems);
    });

    it('dispatches unselectAllItems when unselect button is clicked', () => {
      const unselectButton = screen.getByText('Unselect all');

      fireEvent.click(unselectButton);

      expect(screen.queryByText(/items selected/)).not.toBeInTheDocument();
    });

    it.each([
      [
        'triggers download',
        () => {
          expect(document.querySelector('a[download]')).toBeTruthy();
        },
      ],
    ])('download button %s', (_, assertion) => {
      const downloadButton = screen.getByText('Download');

      fireEvent.click(downloadButton);

      assertion();
    });

    it('generates correct CSV filename based on item count', () => {
      const downloadButton = screen.getByText('Download');

      fireEvent.click(downloadButton);

      const downloadLink = document.querySelector('a[download]');
      expect(downloadLink?.getAttribute('download')).toBe('3_items.csv');
    });
  });
});
