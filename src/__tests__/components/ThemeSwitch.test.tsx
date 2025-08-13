import '@testing-library/jest-dom';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen } from '@/__tests__/utils/TestUtilities';
import ThemeSwitch from '@/components/ThemeSwitch';

vi.mock('lucide-react', () => ({
  Moon: vi.fn(({ ...props }) => <div data-testid="moon-icon" {...props} />),
  Sun: vi.fn(({ ...props }) => <div data-testid="sun-icon" {...props} />),
}));

const mockToggleTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('@/context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => mockUseTheme(),
}));

describe('ThemeSwitch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Theme state rendering', () => {
    it.each([
      ['light', false],
      ['dark', true],
    ])('should render correctly when theme is %s', (theme, isDark) => {
      mockUseTheme.mockReturnValue({
        isDark,
        theme,
        toggleTheme: mockToggleTheme,
      });

      render(<ThemeSwitch />);

      const expectedIconTestId = isDark ? 'moon-icon' : 'sun-icon';
      const expectedAriaLabel = `Switch to ${isDark ? 'light' : 'dark'} theme`;

      expect(screen.getByTestId(expectedIconTestId)).toBeInTheDocument();

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-label', expectedAriaLabel);
      expect(switchButton).toHaveAttribute('aria-checked', isDark.toString());
    });
  });

  describe('Button functionality', () => {
    it.each([
      { isDark: false, theme: 'light' },
      { isDark: true, theme: 'dark' },
    ])(
      'should call toggleTheme when clicked in $theme mode',
      ({ isDark, theme }) => {
        mockUseTheme.mockReturnValue({
          isDark,
          theme,
          toggleTheme: mockToggleTheme,
        });

        render(<ThemeSwitch />);
        const switchButton = screen.getByRole('switch');

        fireEvent.click(switchButton);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe('Edge cases', () => {
    it.each([
      {
        description: 'light theme with isDark false',
        isDark: false,
        theme: 'light',
      },
      {
        description: 'dark theme with isDark true',
        isDark: true,
        theme: 'dark',
      },
      {
        description: 'light theme with isDark true (inconsistent state)',
        isDark: true,
        theme: 'light',
      },
      {
        description: 'dark theme with isDark false (inconsistent state)',
        isDark: false,
        theme: 'dark',
      },
    ])('should handle $description', ({ isDark, theme }) => {
      mockUseTheme.mockReturnValue({
        isDark,
        theme,
        toggleTheme: mockToggleTheme,
      });

      expect(() => render(<ThemeSwitch />)).not.toThrow();

      expect(screen.getByRole('switch')).toBeInTheDocument();

      const expectedIconTestId = isDark ? 'moon-icon' : 'sun-icon';
      expect(screen.getByTestId(expectedIconTestId)).toBeInTheDocument();
    });
  });
});
