import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetPokemonListQuery } from '@api/pokemonApiSlice';
import CacheInvalidationButton from '@components/CacheInvalidationButton';
import { useAppDispatch } from '@store/hooks';

vi.mock('@store/hooks', () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock('@api/pokemonApiSlice', () => ({
  pokemonApi: {
    util: {
      resetApiState: vi.fn(),
    },
  },
  useGetPokemonListQuery: vi.fn(),
}));

const mockUseAppDispatch = vi.mocked(useAppDispatch);
const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);

describe('CacheInvalidationButton', () => {
  const mockDispatch = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseGetPokemonListQuery.mockReturnValue({ refetch: mockRefetch });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the button with the text "Clear Cache"', () => {
    render(<CacheInvalidationButton />);
    expect(
      screen.getByRole('button', { name: /Clear Cache/i })
    ).toBeInTheDocument();
  });
});
