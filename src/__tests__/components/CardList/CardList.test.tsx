import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardList from '../../../components/CardList/CardList';

import { mockPokemonItemsList } from '../../utils/cardComponentsMockData';

describe('CardList', () => {
  it('renders the correct number of Card components for a given list of items', () => {
    render(<CardList pokemonItems={mockPokemonItemsList} />);

    const listItems = screen.getAllByRole('listitem');

    expect(listItems).toHaveLength(mockPokemonItemsList.length);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('renders an empty list and no cards when pokemonItems array is empty', () => {
    render(<CardList pokemonItems={[]} />);

    const listItems = screen.queryAllByRole('listitem');

    expect(listItems).toHaveLength(0);

    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
  });

  it('renders successfully when pokemonItems prop is an empty array', () => {
    expect(() => render(<CardList pokemonItems={[]} />)).not.toThrow();
  });
});
