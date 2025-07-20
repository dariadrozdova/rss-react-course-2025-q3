import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../../../components/Card/Card';

import {
  mockPokemonItemWithImage,
  mockPokemonItemWithoutImage,
  mockPokemonItemUndefinedImage,
} from '../../utils/cardComponentsMockData';

describe('Card', () => {
  it('renders the item name', () => {
    render(<Card item={mockPokemonItemWithImage} />);

    expect(screen.getByText(mockPokemonItemWithImage.name)).toBeInTheDocument();
  });

  it('renders the image when imageUrl is provided', () => {
    render(<Card item={mockPokemonItemWithImage} />);

    const image = screen.getByRole('img', {
      name: mockPokemonItemWithImage.name,
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemonItemWithImage.imageUrl);
    expect(image).toHaveAttribute('alt', mockPokemonItemWithImage.name);
  });

  it('does not render the image when imageUrl is an empty string', () => {
    render(<Card item={mockPokemonItemWithoutImage} />);

    expect(
      screen.queryByRole('img', { name: mockPokemonItemWithoutImage.name })
    ).not.toBeInTheDocument();
  });

  it('does not render the image when imageUrl is undefined', () => {
    render(<Card item={mockPokemonItemUndefinedImage} />);

    expect(
      screen.queryByRole('img', { name: mockPokemonItemUndefinedImage.name })
    ).not.toBeInTheDocument();
  });
});
