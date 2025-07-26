import { fireEvent, render, screen } from '@testing-library/react';
import type { SearchProps } from '@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Search from '@components/Search';

describe('Search Component Tests', () => {
  let mockOnSearch: (searchTerm: string) => void;
  let defaultProps: SearchProps;

  const renderSearch = (props?: Partial<SearchProps>) => {
    return render(<Search {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    mockOnSearch = vi.fn();
    defaultProps = {
      initialSearchTerm: '',
      onSearch: mockOnSearch,
    };
  });

  it('renders search input and search button', () => {
    renderSearch();
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  describe.each([
    ['Bulbasaur', 'Bulbasaur'],
    ['', ''],
  ])(
    'displays input with initial search term "%s"',
    (initialTerm, expectedValue) => {
      it(`value is "${expectedValue}"`, () => {
        renderSearch({ initialSearchTerm: initialTerm });
        const searchInput = screen.getByPlaceholderText(
          /search for pokemons.../i
        );
        expect(searchInput).toHaveValue(expectedValue);
      });
    }
  );

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
    renderSearch();
    const searchInput = screen.getByPlaceholderText(/search for pokemons.../i);

    fireEvent.change(searchInput, { target: { value: 'Charizard' } });
    expect((searchInput as HTMLInputElement).value).toBe('Charizard');
  });

  describe.each([
    [
      'clicking the search button',
      'Mewtwo',
      (_input: Element, button: Element) => fireEvent.click(button),
    ],
    [
      'pressing Enter key in the input',
      'Squirtle',
      (input: Element) =>
        fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' }),
    ],
  ])(
    'triggers onSearch callback with trimmed value when %s',
    (_triggerDesc, searchTerm, triggerAction) => {
      it(`calls onSearch with trimmed "${searchTerm}"`, () => {
        renderSearch();
        const searchInput = screen.getByPlaceholderText(
          /search for pokemons.../i
        );
        const searchButton = screen.getByRole('button', { name: /search/i });

        fireEvent.change(searchInput, {
          target: { value: `  ${searchTerm}  ` },
        });
        triggerAction(searchInput, searchButton);

        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith(searchTerm);
      });
    }
  );
});
