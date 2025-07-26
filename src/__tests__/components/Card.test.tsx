import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Card from '@components/Card';

import {
  mockPokemonItemUndefinedImage,
  mockPokemonItemWithImage,
  mockPokemonItemWithoutImage,
} from '@/__tests__/utils/cardComponentsMockData';

const renderCard = (item: typeof mockPokemonItemWithImage) =>
  render(
    <MemoryRouter>
      <Card currentPage={1} item={item} />
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
});
