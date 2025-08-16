'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import type { PaginationProps } from '@/types/';
import { classNames } from '@/utils/classNames';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  const t = useTranslations('Pagination');

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
      className={classNames('flex justify-center items-center gap-2 mt-8')}
      onClick={handlePaginationClick}
    >
      <Button
        className={classNames(
          'px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
        )}
        color="green"
        disabled={currentPage === 1}
        onClick={handlePageClick(currentPage - 1)}
      >
        {t('previous')}
      </Button>

      {showFirstPage && (
        <>
          <Button
            className={classNames(
              'px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
            )}
            color="green"
            onClick={handlePageClick(1)}
          >
            1
          </Button>
          <span
            className={classNames(
              'px-2 text-[var(--color-text-dark-blue-gray)]'
            )}
          >
            ...
          </span>
        </>
      )}

      {currentPage > 1 && (
        <Button
          className={classNames(
            'px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
          )}
          color="green"
          onClick={handlePageClick(currentPage - 1)}
        >
          {currentPage - 1}
        </Button>
      )}

      <Button
        className={classNames(
          'px-3 py-2 rounded-md shadow-lg bg-green-600 text-white border-green-600 font-semibold ring-2 ring-green-300 ring-offset-1 cursor-default'
        )}
        color="green"
        disabled
      >
        {currentPage}
      </Button>

      {currentPage < totalPages && (
        <Button
          className={classNames(
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
          <span
            className={classNames(
              'px-2 text-[var(--color-text-dark-blue-gray)]'
            )}
          >
            ...
          </span>
          <Button
            className={classNames(
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
        className={classNames(
          'px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'
        )}
        color="green"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={handlePageClick(currentPage + 1)}
      >
        {t('next')}
      </Button>
    </div>
  );
};

export default Pagination;
