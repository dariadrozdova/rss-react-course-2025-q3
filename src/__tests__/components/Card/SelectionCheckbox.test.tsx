import '@testing-library/jest-dom';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import SelectionCheckbox from '@components/Card/SelectionCheckbox';

import { fireEvent, render, screen } from '@/__tests__/utils/TestUtilities';

describe('SelectionCheckbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering based on selection state', () => {
    it.each([
      { description: 'not selected', isItemSelected: false },
      { description: 'selected', isItemSelected: true },
    ])('should render correctly when $description', ({ isItemSelected }) => {
      render(
        <SelectionCheckbox
          isItemSelected={isItemSelected}
          onCheckboxChange={vi.fn()}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      if (isItemSelected) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }

      expect(screen.getByText(/select/i)).toBeInTheDocument();
    });
  });

  describe('Checkbox interaction', () => {
    it('should call onCheckboxChange when clicked', () => {
      const handleChange = vi.fn();
      render(
        <SelectionCheckbox
          isItemSelected={false}
          onCheckboxChange={handleChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });
});
