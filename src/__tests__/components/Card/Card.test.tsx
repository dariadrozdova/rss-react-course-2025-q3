import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Card from '@components/Card/Card';
import { store } from '@store/index';
import {
  setSelectedItems,
  unselectAllItems,
} from '@store/slices/selectedItemsSlice';

import {
  mockPokemonItemWithImage,
  mockPokemonItemWithoutImage,
} from '@/__tests__/utils/cardComponentsMockData';

const renderCard = (item: typeof mockPokemonItemWithImage, props = {}) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Card currentPage={1} item={item} {...props} />
      </MemoryRouter>
    </Provider>
  );

describe('Card', () => {
  beforeEach(() => {
    store.dispatch(unselectAllItems());
  });

  it('renders the item name', () => {
    renderCard(mockPokemonItemWithImage);
    expect(screen.getByText(mockPokemonItemWithImage.name)).toBeInTheDocument();
  });

  it('renders the image when imageUrl is provided', () => {
    renderCard(mockPokemonItemWithImage);
    const image = screen.getByRole('img', {
      name: mockPokemonItemWithImage.name,
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemonItemWithImage.imageUrl);
    expect(image).toHaveAttribute('alt', mockPokemonItemWithImage.name);
  });

  it('uses fallback image URL when imageUrl is not provided', () => {
    renderCard(mockPokemonItemWithoutImage);
    const image = screen.getByRole('img', {
      name: mockPokemonItemWithoutImage.name,
    });

    expect(image).toHaveAttribute(
      'src',
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mockPokemonItemWithoutImage.id}.png`
    );
  });

  describe('with onPokemonClick prop', () => {
    it('calls onPokemonClick when card is clicked', () => {
      const mockOnPokemonClick = vi.fn();
      renderCard(mockPokemonItemWithImage, {
        onPokemonClick: mockOnPokemonClick,
      });

      const cardElement = screen
        .getByText(mockPokemonItemWithImage.name)
        .closest('div');
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      fireEvent.click(cardElement);

      expect(mockOnPokemonClick).toHaveBeenCalledWith(
        mockPokemonItemWithImage.id
      );
    });
  });

  describe('Redux store integration for selection', () => {
    it('adds item to selectedItems when checkbox is clicked', () => {
      renderCard(mockPokemonItemWithImage);

      expect(store.getState().selectedItems.items).toEqual([]);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(store.getState().selectedItems.items).toEqual([
        mockPokemonItemWithImage,
      ]);
    });

    it('removes item from selectedItems when checkbox is clicked', () => {
      store.dispatch(setSelectedItems([mockPokemonItemWithImage]));

      renderCard(mockPokemonItemWithImage);

      expect(store.getState().selectedItems.items).toEqual([
        mockPokemonItemWithImage,
      ]);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(store.getState().selectedItems.items).toEqual([]);
    });
  });

  describe('image error handling edge cases', () => {
    it('handles image error without nextElementSibling', () => {
      renderCard(mockPokemonItemWithImage);
      const image = screen.getByRole('img');

      const originalNextElementSibling = image.nextElementSibling;
      Object.defineProperty(image, 'nextElementSibling', {
        configurable: true,
        get: () => null,
      });

      expect(() => {
        fireEvent.error(image);
        fireEvent.error(image);
      }).not.toThrow();

      Object.defineProperty(image, 'nextElementSibling', {
        configurable: true,
        get: () => originalNextElementSibling,
      });
    });
  });

  describe('image loading states', () => {
    it('shows loading placeholder initially', () => {
      renderCard(mockPokemonItemWithImage);

      const placeholder = screen
        .getByText(mockPokemonItemWithImage.name)
        .parentElement?.querySelector('.animate-pulse');

      expect(placeholder).toBeInTheDocument();
    });

    it('hides image initially and shows after load', () => {
      renderCard(mockPokemonItemWithImage);
      const image = screen.getByRole('img');

      expect(image).toHaveClass('hidden');

      fireEvent.load(image);

      expect(image).not.toHaveClass('hidden');
    });
  });

  describe('click event handling', () => {
    it('renders as Link when onPokemonClick is not provided', () => {
      renderCard(mockPokemonItemWithImage);

      const linkElement = screen.getByRole('link');
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute(
        'href',
        `/1/${mockPokemonItemWithImage.id}`
      );
    });
  });
});
