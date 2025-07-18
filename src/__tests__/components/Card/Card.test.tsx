import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../../../components/Card/Card';
import type { PokemonItem } from '../../../types/types';

describe('Card', () => {
  const mockPokemonItem: PokemonItem = {
    id: 1,
    name: 'Pikachu',
    imageUrl: 'https://example.com/pikachu.png',
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
  };

  const mockPokemonItemWithoutImage: PokemonItem = {
    id: 2,
    name: 'Charmander',
    imageUrl: '',
    url: 'https://pokeapi.co/api/v2/pokemon/charmander',
  };

  const mockPokemonItemNullImage: PokemonItem = {
    id: 3,
    name: 'Squirtle',
    url: 'https://pokeapi.co/api/v2/pokemon/squirtle',
  };

  it('renders the item name', () => {
    render(<Card item={mockPokemonItem} />);

    expect(screen.getByText(mockPokemonItem.name)).toBeInTheDocument();
  });

  it('renders the image when imageUrl is provided', () => {
    render(<Card item={mockPokemonItem} />);

    const image = screen.getByRole('img', { name: mockPokemonItem.name });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemonItem.imageUrl);
    expect(image).toHaveAttribute('alt', mockPokemonItem.name);
  });

  it('does not render the image when imageUrl is an empty string', () => {
    render(<Card item={mockPokemonItemWithoutImage} />);

    expect(
      screen.queryByRole('img', { name: mockPokemonItemWithoutImage.name })
    ).not.toBeInTheDocument();
  });

  it('does not render the image when imageUrl is undefined', () => {
    render(<Card item={mockPokemonItemNullImage} />);

    expect(
      screen.queryByRole('img', { name: mockPokemonItemNullImage.name })
    ).not.toBeInTheDocument();
  });
});
