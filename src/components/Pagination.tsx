import React from 'react';

import type { PaginationProps } from '@types';

import Button from '@components/Button';
import { cn } from '@utils/cn';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const showFirstPage = currentPage > 3;
  const showLastPage = currentPage < totalPages - 2;

  const handlePaginationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onPageChange(page);
  };

  return (
    <div
      className={cn('flex justify-center items-center gap-2 mt-8')}
      onClick={handlePaginationClick}
    >
      <Button
        className={cn(
          'px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
        )}
        color="green"
        disabled={currentPage === 1}
        onClick={handlePageClick(currentPage - 1)}
      >
        Previous
      </Button>

      {showFirstPage && (
        <>
          <Button
            className={cn(
              'px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
            )}
            color="green"
            onClick={handlePageClick(1)}
          >
            1
          </Button>
          <span className={cn('px-2 text-[var(--color-text-dark-blue-gray)]')}>
            ...
          </span>
        </>
      )}

      {currentPage > 1 && (
        <Button
          className={cn(
            'px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
          )}
          color="green"
          onClick={handlePageClick(currentPage - 1)}
        >
          {currentPage - 1}
        </Button>
      )}

      <Button
        className={cn(
          'px-3 py-2 rounded-md shadow-lg bg-green-600 text-white border-green-600 font-semibold ring-2 ring-green-300 ring-offset-1 cursor-default'
        )}
        color="green"
        disabled
      >
        {currentPage}
      </Button>

      {currentPage < totalPages && (
        <Button
          className={cn(
            'px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
          )}
          color="green"
          onClick={handlePageClick(currentPage + 1)}
        >
          {currentPage + 1}
        </Button>
      )}

      {showLastPage && (
        <>
          <span className={cn('px-2 text-[var(--color-text-dark-blue-gray)]')}>
            ...
          </span>
          <Button
            className={cn(
              'px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
            )}
            color="green"
            onClick={handlePageClick(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        className={cn(
          'px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
        )}
        color="green"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={handlePageClick(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
