import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import CardList from '@components/CardList';

import { mockPokemonItemsList } from '@/__tests__/utils/cardComponentsMockData';

describe('CardList', () => {
  it('renders the correct number of Card components for a given list of items', () => {
    render(
      <MemoryRouter>
        <CardList currentPage={1} pokemonItems={mockPokemonItemsList} />
      </MemoryRouter>
    );

    const listItems = screen.getAllByRole('listitem');

    expect(listItems).toHaveLength(mockPokemonItemsList.length);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Squirtle')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('renders an empty list and no cards when pokemonItems array is empty', () => {
    render(
      <MemoryRouter>
        <CardList currentPage={1} pokemonItems={[]} />
      </MemoryRouter>
    );

    const listItems = screen.queryAllByRole('listitem');

    expect(listItems).toHaveLength(0);

    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
  });
});
