import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import CardList from '@components/CardList';

import { mockPokemonItemsList } from '@/__tests__/utils/cardComponentsMockData';

vi.mock('@components/Card', () => ({
  default: vi.fn(({ currentPage, isSelected, item, onPokemonClick }) => (
    <li
      data-current-page={currentPage}
      data-has-click-handler={!!onPokemonClick}
      data-selected={isSelected}
      data-testid={`card-${item.id}`}
    >
      {item.name}
    </li>
  )),
}));

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

  it('renders an empty list when pokemonItems array is empty', () => {
    render(
      <MemoryRouter>
        <CardList currentPage={1} pokemonItems={[]} />
      </MemoryRouter>
    );

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
  });

  it('passes onPokemonClick prop to Card when provided', () => {
    const mockOnPokemonClick = vi.fn();

    render(
      <MemoryRouter>
        <CardList
          currentPage={1}
          onPokemonClick={mockOnPokemonClick}
          pokemonItems={mockPokemonItemsList}
        />
      </MemoryRouter>
    );

    const cards = screen.getAllByTestId(/^card-/);
    for (const card of cards) {
      expect(card).toHaveAttribute('data-has-click-handler', 'true');
    }
  });

  it('passes selectedPokemonId correctly to determine isSelected prop', () => {
    const selectedId = mockPokemonItemsList[0].id;

    render(
      <MemoryRouter>
        <CardList
          currentPage={1}
          pokemonItems={mockPokemonItemsList}
          selectedPokemonId={selectedId}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId(`card-${selectedId}`)).toHaveAttribute(
      'data-selected',
      'true'
    );

    const otherCards = mockPokemonItemsList
      .filter((item) => item.id !== selectedId)
      .map((item) => screen.getByTestId(`card-${item.id}`));

    for (const card of otherCards) {
      expect(card).toHaveAttribute('data-selected', 'false');
    }
  });
});
