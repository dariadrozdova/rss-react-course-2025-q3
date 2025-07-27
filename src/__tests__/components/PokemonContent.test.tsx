import { render, screen } from '@testing-library/react';
import type { PokemonItem } from '@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PokemonContent } from '@components/PokemonContent';

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

vi.mock('@components/SkeletonCardList', () => ({
  default: vi.fn(({ count }: { count: number }) => (
    <div data-testid="skeleton-card-list">Loading {count} cards...</div>
  )),
}));

describe('PokemonContent', () => {
  const defaultProps = {
    currentPage: 1,
    effectiveSearchTerm: '',
    onPageChange: vi.fn(),
    totalItems: 0,
    totalPages: 0,
  };

  const mockPokemonItems: PokemonItem[] = [
    { id: 1, imageUrl: 'url1', name: 'bulbasaur', url: 'url1' },
    { id: 2, imageUrl: 'url2', name: 'charmander', url: 'url2' },
    { id: 3, imageUrl: 'url3', name: 'squirtle', url: 'url3' },
    { id: 4, imageUrl: 'url4', name: 'pidgey', url: 'url4' },
    { id: 5, imageUrl: 'url5', name: 'rattata', url: 'url5' },
  ];

  let renderProps: any;

  beforeEach(() => {
    renderProps = { ...defaultProps };
  });

  const renderComponent = (overrideProps = {}) => {
    const props = { ...renderProps, ...overrideProps };
    return render(<PokemonContent {...props} />);
  };

  describe('successful data display', () => {
    beforeEach(() => {
      renderProps = {
        ...defaultProps,
        error: null,
        isLoading: false,
        pokemonItems: mockPokemonItems,
        totalItems: 21,
        totalPages: 2,
      };
    });

    it('displays Pokemon items when data is loaded successfully', () => {
      renderComponent();

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('charmander')).toBeInTheDocument();
      expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('error states', () => {
    beforeEach(() => {
      renderProps = {
        ...defaultProps,
        error: 'Failed to load Pokemon',
        isLoading: false,
        pokemonItems: [],
      };
    });

    it('displays an error message when error prop is present', () => {
      renderComponent();

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
      expect(
        screen.getByText('Error: Failed to load Pokemon')
      ).toBeInTheDocument();
      expect(screen.queryByText(/No Pokemon found/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    beforeEach(() => {
      renderProps = {
        ...defaultProps,
        error: null,
        isLoading: true,
        pokemonItems: [],
      };
    });

    it('displays SkeletonCardList when isLoading is true', () => {
      renderComponent();

      expect(screen.getByTestId('skeleton-card-list')).toBeInTheDocument();
      expect(screen.getByText('Loading 20 cards...')).toBeInTheDocument();
      expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
    });
  });

  describe.each([
    {
      props: {
        error: null,
        isLoading: false,
        pokemonItems: [mockPokemonItems[0]],
        totalItems: null,
        totalPages: 1,
      },
      scenario: 'totalItems is null',
    },
    {
      props: {
        error: null,
        isLoading: false,
        pokemonItems: [mockPokemonItems[0]],
        totalItems: 5,
        totalPages: 1,
      },
      scenario: 'totalPages is 1',
    },
    {
      props: {
        error: null,
        isLoading: false,
        pokemonItems: [],
        totalItems: 0,
        totalPages: 0,
      },
      scenario: 'totalItems is 0',
    },
  ])('pagination visibility - $scenario', ({ props }) => {
    beforeEach(() => {
      renderProps = { ...defaultProps, ...props };
    });

    it('does not show pagination', () => {
      renderComponent();
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe.each([
    {
      additionalProps: { onPokemonClick: vi.fn() },
      scenario: 'with onPokemonClick prop',
    },
    {
      additionalProps: { selectedPokemonId: 1 },
      scenario: 'with selectedPokemonId defined',
    },
    {
      additionalProps: { selectedPokemonId: undefined },
      scenario: 'with selectedPokemonId undefined',
    },
  ])('CardList props handling - $scenario', ({ additionalProps }) => {
    beforeEach(() => {
      renderProps = {
        ...defaultProps,
        error: null,
        isLoading: false,
        pokemonItems: [mockPokemonItems[0]],
        totalItems: 1,
        totalPages: 1,
        ...additionalProps,
      };
    });

    it('renders CardList with appropriate props', () => {
      renderComponent();
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
    });
  });
});
