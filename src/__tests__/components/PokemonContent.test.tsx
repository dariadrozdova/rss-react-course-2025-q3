import { render, screen } from '@testing-library/react';
import type { PokemonItem } from '@types';
import { describe, expect, it, vi } from 'vitest';

import { PokemonContent } from '@components/PokemonContent';

const ITEMS_PER_PAGE = 20;

vi.mock('@components/Loader', () => ({
  default: vi.fn(() => <div data-testid="loader">Loading...</div>),
}));

vi.mock('@components/CardList', () => ({
  default: vi.fn(({ pokemonItems }) => (
    <ul data-testid="card-list">
      {pokemonItems.map((item: PokemonItem) => (
        <li data-testid={`card-item-${item.id}`} key={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  )),
}));

vi.mock('@components/Pagination', () => ({
  default: vi.fn(
    ({
      currentPage,
      onPageChange,
      totalPages,
    }: {
      currentPage: number;
      onPageChange: (page: number) => void;
      totalPages: number;
    }) => (
      <div data-testid="pagination">
        {' '}
        {/* ADDED data-testid HERE */}
        Page {currentPage} of {totalPages}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>
    )
  ),
}));

describe('PokemonContent', () => {
  const defaultProps = {
    currentPage: 1,
    effectiveSearchTerm: '',
    onPageChange: vi.fn(),
    totalItems: 0,
    totalPages: 0,
  };

  it('displays loader when isLoading is true', () => {
    render(
      <PokemonContent
        {...defaultProps}
        error={null}
        isLoading
        pokemonItems={[]}
      />
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
  });

  it('displays Pokemon items when data is loaded successfully', () => {
    const mockPokemonItems: PokemonItem[] = [
      { id: 1, imageUrl: 'url1', name: 'bulbasaur', url: 'url1' },
      { id: 2, imageUrl: 'url2', name: 'charmander', url: 'url2' },
      { id: 3, imageUrl: 'url3', name: 'squirtle', url: 'url3' },
      { id: 4, imageUrl: 'url4', name: 'pidgey', url: 'url4' },
      { id: 5, imageUrl: 'url5', name: 'rattata', url: 'url5' },
    ];
    render(
      <PokemonContent
        {...defaultProps}
        error={null}
        isLoading={false}
        pokemonItems={mockPokemonItems}
        totalItems={21}
        totalPages={2}
      />
    );

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('displays an error message when error prop is present', () => {
    render(
      <PokemonContent
        {...defaultProps}
        error="Failed to load Pokemon"
        isLoading={false}
        pokemonItems={[]}
      />
    );

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(
      screen.getByText('Error: Failed to load Pokemon')
    ).toBeInTheDocument();
    expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('displays "No Pokemon found" message when search yields no results (empty pokemonItems and effectiveSearchTerm)', () => {
    render(
      <PokemonContent
        {...defaultProps}
        effectiveSearchTerm="nonexistent"
        error={null}
        isLoading={false}
        pokemonItems={[]}
        totalItems={0}
      />
    );

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /No Pokemon found for "nonexistent". Try a different search!/i
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('does not display "No Pokemon found" message if there are no items but no search term', () => {
    render(
      <PokemonContent
        {...defaultProps}
        effectiveSearchTerm=""
        error={null}
        isLoading={false}
        pokemonItems={[]}
        totalItems={0}
      />
    );

    expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
  });

  it('displays pagination when there are items and multiple pages', () => {
    const mockPokemonItems: PokemonItem[] = Array.from({ length: 30 }).map(
      (_, index) => ({
        id: index + 1,
        imageUrl: `url${index + 1}`,
        name: `pokemon-${index + 1}`,
        url: `url${index + 1}`,
      })
    );

    render(
      <PokemonContent
        {...defaultProps}
        currentPage={1}
        error={null}
        isLoading={false}
        pokemonItems={mockPokemonItems.slice(0, ITEMS_PER_PAGE)}
        totalItems={30}
        totalPages={2}
      />
    );
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
