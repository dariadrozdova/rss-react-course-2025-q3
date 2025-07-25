import { fireEvent, render, screen } from '@testing-library/react';
import type { SearchProps } from '@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Search from '@components/Search';

describe('Search Component Tests', () => {
  let mockOnSearch: (searchTerm: string) => void;
  let defaultProps: SearchProps;

  beforeEach(() => {
    mockOnSearch = vi.fn();
    defaultProps = {
      initialSearchTerm: '',
      onSearch: mockOnSearch,
    };
  });

  it('renders search input and search button', () => {
    render(<Search {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('displays the initial search term provided via props in the input on mount', () => {
    const initialTerm = 'Bulbasaur';
    render(<Search {...defaultProps} initialSearchTerm={initialTerm} />);

    const searchInput = screen.getByDisplayValue(initialTerm);
    expect(searchInput).toBeInTheDocument();
  });

  it('shows an empty input when no initial search term is provided via props', () => {
    render(<Search {...defaultProps} initialSearchTerm={''} />);

    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);
    expect(searchInput).toHaveValue('');
  });

  it('updates input value when initialSearchTerm prop changes (simulating parent update)', () => {
    const { rerender } = render(
      <Search {...defaultProps} initialSearchTerm="initial" />
    );
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);

    expect(searchInput).toHaveValue('initial');

    rerender(<Search {...defaultProps} initialSearchTerm="updated term" />);
    expect(searchInput).toHaveValue('updated term');
  });

  it('retains user-typed input if a subsequent prop update contains the same value as the initial prop', () => {
    const { rerender } = render(
      <Search {...defaultProps} initialSearchTerm="same term" />
    );
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);

    expect(searchInput).toHaveValue('same term');

    fireEvent.change(searchInput, { target: { value: 'user typed' } });
    expect(searchInput).toHaveValue('user typed');

    rerender(<Search {...defaultProps} initialSearchTerm="same term" />);

    expect(searchInput).toHaveValue('user typed');
  });

  it('updates input value as the user types', () => {
    render(<Search {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);

    fireEvent.change(searchInput, { target: { value: 'Charizard' } });
    expect((searchInput as HTMLInputElement).value).toBe('Charizard');
  });

  it('triggers onSearch callback with trimmed value when search button is clicked', async () => {
    render(<Search {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: '  Mewtwo  ' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Mewtwo');
  });

  it('triggers onSearch callback with trimmed value when Enter key is pressed in the input', async () => {
    render(<Search {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);

    fireEvent.change(searchInput, { target: { value: '  Squirtle  ' } });
    fireEvent.keyDown(searchInput, { code: 'Enter', key: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Squirtle');
  });
});
