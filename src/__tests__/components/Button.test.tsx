import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import Button from '@/components/Button';
import {
  BUTTON_BASE_CLASSES,
  BUTTON_COLOR_GREEN,
  BUTTON_COLOR_RED,
} from '@/utils/stylesConstants';

describe('Button', () => {
  let button: HTMLElement;

  describe.each([
    {
      color: undefined,
      description: 'default',
      expectedClass: BUTTON_COLOR_GREEN,
    },
    {
      color: 'green' as const,
      description: 'green',
      expectedClass: BUTTON_COLOR_GREEN,
    },
    {
      color: 'red' as const,
      description: 'red',
      expectedClass: BUTTON_COLOR_RED,
    },
  ])('color variants', ({ color, description, expectedClass }) => {
    beforeEach(() => {
      render(<Button {...(color && { color })}>Click me</Button>);
      button = screen.getByRole('button');
    });

    it(`should apply ${description} styling`, () => {
      expect(button).toHaveClass(expectedClass);
    });

    it('should apply base classes', () => {
      expect(button).toHaveClass(BUTTON_BASE_CLASSES);
    });
  });

  describe('props handling', () => {
    beforeEach(() => {
      render(
        <Button className="custom-class" disabled onClick={() => {}}>
          Test
        </Button>
      );
      button = screen.getByRole('button');
    });

    it.each([
      ['custom className', 'custom-class'],
      ['base classes', BUTTON_BASE_CLASSES],
      ['disabled attribute', 'disabled'],
    ])('should handle %s', (_, expected) => {
      if (expected === 'disabled') {
        expect(button).toBeDisabled();
      } else {
        expect(button).toHaveClass(expected);
      }
    });
  });
});
