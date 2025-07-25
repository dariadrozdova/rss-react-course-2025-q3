import type { PaginationProps } from '@types';
import React from 'react';

import Button from '@components/Button';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        className="px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
        color="green"
        disabled={currentPage === 1}
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
      >
        Previous
      </Button>
      <span className="text-lg font-medium text-[var(--color-text-dark-blue-gray)]">
        Page {currentPage} of {totalPages === 0 ? 1 : totalPages}{' '}
      </span>
      <Button
        className="px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
        color="green"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
