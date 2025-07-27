import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import Card from '@components/Card';

import {
  mockPokemonItemUndefinedImage,
  mockPokemonItemWithImage,
  mockPokemonItemWithoutImage,
} from '@/__tests__/utils/cardComponentsMockData';

const renderCard = (item: typeof mockPokemonItemWithImage, props = {}) =>
  render(
    <MemoryRouter>
      <Card currentPage={1} item={item} {...props} />
    </MemoryRouter>
  );

describe('Card', () => {
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

  it('renders the fallback image URL on error and then "No Image" if the fallback also fails', () => {
    renderCard(mockPokemonItemWithImage);
    const image = screen.getByRole('img', {
      name: mockPokemonItemWithImage.name,
    });

    fireEvent.error(image);

    expect(image).toHaveAttribute(
      'src',
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${mockPokemonItemWithImage.id}.png`
    );

    fireEvent.error(image);

    expect(image).toHaveStyle('display: none');
    expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toHaveStyle('display: flex');
  });

  it.each([
    ['empty string', mockPokemonItemWithoutImage],
    ['undefined', mockPokemonItemUndefinedImage],
  ])(
    'renders the fallback "No Image" when imageUrl is %s or errors',
    (_, item) => {
      renderCard(item);

      const image = screen.getByRole('img', { name: item.name });

      fireEvent.error(image);

      fireEvent.error(image);

      expect(image).toHaveStyle('display: none');
      expect(screen.getByText('No Image')).toBeInTheDocument();
      expect(screen.getByText('No Image')).toHaveStyle('display: flex');
    }
  );

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

  describe('isSelected prop', () => {
    it('applies selected styles when isSelected is true', () => {
      renderCard(mockPokemonItemWithImage, { isSelected: true });

      const nameElement = screen.getByText(mockPokemonItemWithImage.name);
      expect(nameElement).toHaveClass('text-teal-600');

      const container = nameElement.closest('a') || nameElement.closest('div');
      expect(container).toHaveClass(
        'border-teal-400',
        'shadow-lg',
        'ring-2',
        'ring-teal-200',
        '-translate-y-1'
      );
    });

    it('applies default styles when isSelected is false', () => {
      renderCard(mockPokemonItemWithImage, { isSelected: false });

      const nameElement = screen.getByText(mockPokemonItemWithImage.name);
      expect(nameElement).toHaveClass(
        'text-gray-800',
        'group-hover:text-teal-600'
      );

      const container = nameElement.closest('a') || nameElement.closest('div');
      expect(container).toHaveClass('border-gray-200');
      expect(container).not.toHaveClass(
        'border-teal-400',
        'shadow-lg',
        'ring-2'
      );
    });

    it('uses false as default when isSelected is not provided', () => {
      renderCard(mockPokemonItemWithImage);

      const nameElement = screen.getByText(mockPokemonItemWithImage.name);
      expect(nameElement).toHaveClass('text-gray-800');
    });
  });

  describe('image error handling edge cases', () => {
    it('handles image error without nextElementSibling', () => {
      renderCard(mockPokemonItemWithImage);
      const image = screen.getByRole('img');

      // Mock DOM structure where nextElementSibling might not exist
      const originalNextElementSibling = image.nextElementSibling;
      Object.defineProperty(image, 'nextElementSibling', {
        configurable: true,
        get: () => null,
      });

      // Should not throw error when nextElementSibling is null
      expect(() => {
        fireEvent.error(image);
        fireEvent.error(image);
      }).not.toThrow();

      // Restore original property
      Object.defineProperty(image, 'nextElementSibling', {
        configurable: true,
        get: () => originalNextElementSibling,
      });
    });
  });
});
