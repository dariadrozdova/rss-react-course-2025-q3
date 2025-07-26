import { fireEvent, render, screen } from '@testing-library/react';
import type { PaginationProps } from '@types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Pagination from '@components/Pagination';

const DEFAULT_TOTAL_PAGES = 10;
const FIRST_PAGE = 1;
const MIDDLE_PAGE = 5;
const LAST_PAGE = DEFAULT_TOTAL_PAGES;

const ELLIPSIS_THRESHOLD_SHOW_FIRST_PAGE = 4;
const ELLIPSIS_THRESHOLD_SHOW_LAST_PAGE = DEFAULT_TOTAL_PAGES - 2;

const TOTAL_PAGES_TWO = 2;
const TOTAL_PAGES_THREE = 3;
const TOTAL_PAGES_FIVE = 5;

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();
  let defaultProps: PaginationProps;

  beforeEach(() => {
    mockOnPageChange.mockClear();
    defaultProps = {
      currentPage: FIRST_PAGE,
      onPageChange: mockOnPageChange,
      totalPages: DEFAULT_TOTAL_PAGES,
    };
  });

  const renderPagination = (props?: Partial<PaginationProps>) => {
    return render(<Pagination {...defaultProps} {...props} />);
  };

  it.each([1, 0])(
    'does not render if totalPages is %s or less',
    (totalPages) => {
      const { container } = renderPagination({ totalPages });
      expect(container).toBeEmptyDOMElement();
    }
  );

  it('renders "Previous", current page, and "Next" buttons', () => {
    renderPagination({
      currentPage: MIDDLE_PAGE,
      totalPages: DEFAULT_TOTAL_PAGES,
    });
    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: String(MIDDLE_PAGE) })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: String(MIDDLE_PAGE - 1) })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: String(MIDDLE_PAGE + 1) })
    ).toBeInTheDocument();
  });

  describe.each([
    ['Previous', FIRST_PAGE, true],
    ['Next', LAST_PAGE, true],
    ['Previous', MIDDLE_PAGE, false],
    ['Next', MIDDLE_PAGE, false],
  ])('button state for %s button', (buttonName, currentPage, isDisabled) => {
    it(`"${buttonName}" button is ${isDisabled ? 'disabled' : 'enabled'} on page ${currentPage}`, () => {
      renderPagination({ currentPage, totalPages: DEFAULT_TOTAL_PAGES });
      const button = screen.getByRole('button', {
        name: new RegExp(buttonName, 'i'),
      });
      if (isDisabled) {
        expect(button).toBeDisabled();
      } else {
        expect(button).not.toBeDisabled();
      }
    });
  });

  describe.each([
    ['Previous', MIDDLE_PAGE, MIDDLE_PAGE - 1, /previous/i],
    ['Next', MIDDLE_PAGE, MIDDLE_PAGE + 1, /next/i],
    [
      'previous numbered',
      MIDDLE_PAGE,
      MIDDLE_PAGE - 1,
      String(MIDDLE_PAGE - 1),
    ],
    ['next numbered', MIDDLE_PAGE, MIDDLE_PAGE + 1, String(MIDDLE_PAGE + 1)],
    ['first page', MIDDLE_PAGE, FIRST_PAGE, String(FIRST_PAGE)],
    ['last page', MIDDLE_PAGE, LAST_PAGE, String(LAST_PAGE)],
  ])(
    'click handling for %s button',
    (buttonDesc, currentPage, expectedPage, buttonName) => {
      it(`calls onPageChange with ${expectedPage} when ${buttonDesc} button is clicked`, () => {
        renderPagination({ currentPage, totalPages: DEFAULT_TOTAL_PAGES });
        fireEvent.click(screen.getByRole('button', { name: buttonName }));
        expect(mockOnPageChange).toHaveBeenCalledTimes(1);
        expect(mockOnPageChange).toHaveBeenCalledWith(expectedPage);
      });
    }
  );

  describe.each([
    [ELLIPSIS_THRESHOLD_SHOW_FIRST_PAGE, true],
    [ELLIPSIS_THRESHOLD_SHOW_FIRST_PAGE - 1, false],
  ])(
    'first page/ellipsis visibility on page %s',
    (currentPage, shouldBeVisible) => {
      it(`${shouldBeVisible ? 'shows' : 'does not show'} first page button and ellipsis`, () => {
        renderPagination({ currentPage, totalPages: DEFAULT_TOTAL_PAGES });
        const firstPageButton = screen.queryByRole('button', {
          name: String(FIRST_PAGE),
        });
        const ellipses = screen.queryAllByText('...');

        if (shouldBeVisible) {
          expect(firstPageButton).toBeInTheDocument();
          expect(ellipses.length).toBeGreaterThanOrEqual(1);
          expect(ellipses[0]).toBeInTheDocument();
        } else {
          expect(firstPageButton).not.toBeInTheDocument();
          expect(ellipses.length).toBeLessThan(2);
        }
      });
    }
  );

  describe.each([
    [ELLIPSIS_THRESHOLD_SHOW_LAST_PAGE - 1, true],
    [ELLIPSIS_THRESHOLD_SHOW_LAST_PAGE, false],
  ])(
    'last page/ellipsis visibility on page %s',
    (currentPage, shouldBeVisible) => {
      it(`${shouldBeVisible ? 'shows' : 'does not show'} last page button and ellipsis`, () => {
        renderPagination({ currentPage, totalPages: DEFAULT_TOTAL_PAGES });
        const lastPageButton = screen.queryByRole('button', {
          name: String(LAST_PAGE),
        });
        const ellipses = screen.queryAllByText('...');

        if (shouldBeVisible) {
          expect(lastPageButton).toBeInTheDocument();
          expect(ellipses.length).toBeGreaterThanOrEqual(1);
          expect(ellipses.at(-1)).toBeInTheDocument();
        } else {
          expect(lastPageButton).not.toBeInTheDocument();
          expect(ellipses.length).toBeLessThan(2);
        }
      });
    }
  );

  describe.each([
    [
      TOTAL_PAGES_TWO,
      FIRST_PAGE,
      [FIRST_PAGE, TOTAL_PAGES_TWO],
      { nextDisabled: false, noEllipsis: true, prevDisabled: true },
    ],
    [
      TOTAL_PAGES_THREE,
      2,
      [FIRST_PAGE, 2, TOTAL_PAGES_THREE],
      { nextDisabled: false, noEllipsis: true, prevDisabled: false },
    ],
    [
      TOTAL_PAGES_FIVE,
      3,
      [3 - 1, 3, 3 + 1],
      { nextDisabled: false, noEllipsis: true, prevDisabled: false },
    ],
  ])(
    'renders correctly for %s total pages',
    (
      totalPages,
      currentPage,
      expectedPages,
      { nextDisabled, noEllipsis, prevDisabled }
    ) => {
      it(`displays correct buttons and state for ${totalPages} pages on page ${currentPage}`, () => {
        renderPagination({ currentPage, totalPages });
        for (const page of expectedPages) {
          expect(
            screen.getByRole('button', { name: String(page) })
          ).toBeInTheDocument();
        }
        if (noEllipsis) {
          expect(screen.queryByText('...')).not.toBeInTheDocument();
        }
        const previousButton = screen.getByRole('button', {
          name: /previous/i,
        });
        const nextButton = screen.getByRole('button', { name: /next/i });

        if (prevDisabled) {
          expect(previousButton).toBeDisabled();
        } else {
          expect(previousButton).not.toBeDisabled();
        }

        if (nextDisabled) {
          expect(nextButton).toBeDisabled();
        } else {
          expect(nextButton).not.toBeDisabled();
        }
      });
    }
  );

  it('stops propagation on the main div click', () => {
    const mockStopPropagation = vi.fn();
    const TEST_TOTAL_PAGES = 5;
    render(
      <div onClick={mockStopPropagation}>
        <Pagination {...defaultProps} totalPages={TEST_TOTAL_PAGES} />
      </div>
    );
    fireEvent.click(screen.getByText(String(FIRST_PAGE)));
    expect(mockStopPropagation).not.toHaveBeenCalled();
  });
});
