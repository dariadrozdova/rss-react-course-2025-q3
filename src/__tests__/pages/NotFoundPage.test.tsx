import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import NotFoundPage from '@pages/NotFoundPage';

import { ThemeProvider } from '@/context/ThemeContext';

const NotFoundPageWithProviders = () => (
  <MemoryRouter>
    <ThemeProvider>
      <NotFoundPage />
    </ThemeProvider>
  </MemoryRouter>
);

describe('NotFoundPage', () => {
  beforeEach(() => {
    render(<NotFoundPageWithProviders />);
  });

  describe('content display', () => {
    it('displays 404 error numbers and pokeball image', () => {
      const errorNumbers = screen.getAllByText('4');
      expect(errorNumbers).toHaveLength(2);

      const pokeballImage = screen.getByRole('img', { name: 'Poké Ball' });
      expect(pokeballImage).toBeInTheDocument();
      expect(pokeballImage).toHaveAttribute('src', '/icons/pokeball.png');
    });

    it.each([
      ["Looks like this page doesn't exist!"],
      ['Go back to the homepage and continue exploring.'],
    ])('displays error message: %s', (message) => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('displays return link with correct text and destination', () => {
      const returnLink = screen.getByRole('link', {
        name: 'Back to Homepage',
      });

      expect(returnLink).toBeInTheDocument();
      expect(returnLink).toHaveAttribute('href', '/');
    });

    it('renders NavLink component for navigation', () => {
      const navLinks = screen.getAllByRole('link');
      expect(navLinks).toHaveLength(1);
    });
  });

  describe('visual elements', () => {
    it('displays complete 404 visual representation', () => {
      const errorNumbers = screen.getAllByText('4');
      const pokeballImage = screen.getByRole('img', { name: 'Poké Ball' });

      expect(errorNumbers).toHaveLength(2);
      expect(pokeballImage).toBeInTheDocument();
    });
  });
});
