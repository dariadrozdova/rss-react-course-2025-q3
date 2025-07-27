import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PokemonDetails from '@components/PokemonDetails';

vi.mock('@hooks/useLoaderTimeout');
vi.mock('@hooks/usePokemonDetails');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(),
    useParams: vi.fn(),
  };
});

import { useOutletContext, useParams } from 'react-router-dom';

import { useLoaderTimeout } from '@hooks/useLoaderTimeout';
import { usePokemonDetails } from '@hooks/usePokemonDetails';

const mockUseLoaderTimeout = vi.mocked(useLoaderTimeout);
const mockUsePokemonDetails = vi.mocked(usePokemonDetails);
const mockUseParameters = vi.mocked(useParams);
const mockUseOutletContext = vi.mocked(useOutletContext);

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  stats: [{ base_stat: 45, stat: { name: 'hp' } }],
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
};

const mockHandleCloseDetails = vi.fn();

describe('PokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParameters.mockReturnValue({ detailsId: '1' });
    mockUseOutletContext.mockReturnValue({
      handleCloseDetails: mockHandleCloseDetails,
    });
    mockUseLoaderTimeout.mockReturnValue(false);
    mockUsePokemonDetails.mockReturnValue({
      error: null,
      isLoading: false,
      pokemon: mockPokemon,
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <PokemonDetails />
      </MemoryRouter>
    );

  describe('loading states', () => {
    it.each([
      ['isLoading is true', { isLoading: true, showLoader: false }],
      ['showLoader is true', { isLoading: false, showLoader: true }],
    ])('displays loading content when %s', (_, { isLoading, showLoader }) => {
      mockUsePokemonDetails.mockReturnValue({
        error: null,
        isLoading,
        pokemon: null,
      });
      mockUseLoaderTimeout.mockReturnValue(showLoader);

      renderComponent();

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);
      expect(mockHandleCloseDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      mockUsePokemonDetails.mockReturnValue({
        error: 'Failed to fetch Pokemon',
        isLoading: false,
        pokemon: null,
      });
    });

    it('displays error message with functional buttons', () => {
      renderComponent();

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch Pokemon')).toBeInTheDocument();
    });

    it.each([
      ['close button', () => screen.getAllByRole('button')[0]],
      [
        'go back button',
        () => screen.getByRole('button', { name: /go back/i }),
      ],
    ])('calls handleCloseDetails when %s is clicked', (_, getButton) => {
      renderComponent();
      fireEvent.click(getButton());
      expect(mockHandleCloseDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('not found state', () => {
    beforeEach(() => {
      mockUsePokemonDetails.mockReturnValue({
        error: null,
        isLoading: false,
        pokemon: null,
      });
    });

    it('displays not found message with functional buttons', () => {
      renderComponent();

      expect(screen.getByText('Not Found')).toBeInTheDocument();
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });

    it.each([
      ['close button', () => screen.getAllByRole('button')[0]],
      [
        'go back button',
        () => screen.getByRole('button', { name: /go back/i }),
      ],
    ])('calls handleCloseDetails when %s is clicked', (_, getButton) => {
      renderComponent();
      fireEvent.click(getButton());
      expect(mockHandleCloseDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('success state', () => {
    it('displays pokemon information and handles close', () => {
      renderComponent();

      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();

      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);
      expect(mockHandleCloseDetails).toHaveBeenCalledTimes(1);
    });

    it('displays image when available', () => {
      renderComponent();

      const image = screen.getByRole('img', { name: 'bulbasaur' });
      expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
    });

    it('displays placeholder when image not available', () => {
      mockUsePokemonDetails.mockReturnValue({
        error: null,
        isLoading: false,
        pokemon: { ...mockPokemon, sprites: { front_default: null } },
      });

      renderComponent();

      expect(screen.getByText('No image')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('displays pokemon types', () => {
      renderComponent();

      expect(screen.getByText('Types')).toBeInTheDocument();
      expect(screen.getByText('grass')).toBeInTheDocument();
      expect(screen.getByText('poison')).toBeInTheDocument();
    });

    it('displays pokemon stats', () => {
      renderComponent();

      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('hp:')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });

  describe('hook integration', () => {
    it('passes correct parameters to hooks', () => {
      mockUseParameters.mockReturnValue({ detailsId: '25' });
      renderComponent();

      expect(mockUsePokemonDetails).toHaveBeenCalledWith('25');
      expect(mockUseLoaderTimeout).toHaveBeenCalledWith('25');
    });
  });
});
