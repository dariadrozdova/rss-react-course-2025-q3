import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import AboutPage from '@pages/AboutPage';

import { ThemeProvider } from '@/context/ThemeContext';

const AboutPageWithProviders = () => (
  <ThemeProvider>
    <AboutPage />
  </ThemeProvider>
);

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPageWithProviders />);
  });

  describe('content display', () => {
    it('displays main heading and logo', () => {
      expect(screen.getByText('About This App')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'App Logo' })).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        '/icons/favicon.svg'
      );
    });

    it.each([
      ['App Overview', 'This is a Pokémon Explorer application'],
      ['Author', 'Daria Tkachenko'],
      ['The Course', 'This project is a practical assignment'],
    ])('displays %s section with content', (heading, expectedContent) => {
      expect(screen.getByText(heading)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(expectedContent))).toBeInTheDocument();
    });
  });

  describe('external links', () => {
    const linkTestCases = [
      {
        description: 'RS School course link in app overview',
        text: 'RS School React Course',
        url: 'https://rs.school/courses/reactjs',
      },
      {
        description: 'GitHub profile link in author section',
        text: 'GitHub Profile',
        url: 'https://github.com/dariadrozdova',
      },
      {
        description: 'RS School course link in course section',
        text: 'RS School React Course',
        url: 'https://rs.school/courses/reactjs',
      },
    ];

    describe.each(linkTestCases)('$description', ({ text, url }) => {
      it('renders link with correct text and attributes', () => {
        const links = screen.getAllByText(text);
        const link = links.find((l) => l.tagName === 'A') || links[0];

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', url);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('has correct number of external links', () => {
      const allLinks = screen.getAllByRole('link');
      expect(allLinks).toHaveLength(3);
    });
  });

  describe('content structure', () => {
    it.each([
      ['heading', { level: 1 }, 'About This App'],
      ['heading', { level: 2, name: 'App Overview' }, 'App Overview'],
      ['heading', { level: 2, name: 'Author' }, 'Author'],
      ['heading', { level: 2, name: 'The Course' }, 'The Course'],
    ])('displays %s with correct content', (role, options, expectedText) => {
      const element = screen.getByRole(role as any, options);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(expectedText);
    });

    it('displays author information', () => {
      expect(screen.getByText('Daria Tkachenko')).toBeInTheDocument();
    });

    it('displays app description with API mention', () => {
      const description = screen.getByText(
        /allows users to search for Pokémon/
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('powered by the Pokémon API');
    });
  });
});
