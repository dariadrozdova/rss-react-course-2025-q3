'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import Button from '@/components/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
} from '@/store/selectors';
import { unselectAllItems } from '@/store/slices/selectedItemsSlice';
import { classNames } from '@/utils/classNames';

const SelectionFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);
  const selectedCount = useAppSelector(selectSelectedItemsCount);

  const handleUnselectAll = () => {
    dispatch(unselectAllItems());
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download-csv', {
        body: JSON.stringify({ items: selectedItems }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedCount}_items.csv`;
      document.body.append(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('CSV download failed:', error);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={classNames(`fixed bottom-0 left-0 right-0 z-[9999] p-3 shadow-2xl border-t
          bg-theme-secondary border-theme`)}
        exit={{ opacity: 0, y: 100 }}
        initial={{ opacity: 0, y: 100 }}
        style={{
          height: '72px',
          pointerEvents: 'auto',
        }}
        transition={{ damping: 30, stiffness: 300, type: 'spring' }}
      >
        <div
          className={classNames(
            'max-w-5xl mx-auto flex items-center justify-between h-full'
          )}
        >
          <div className={classNames('flex items-center')}>
            <span
              className={classNames(`text-sm font-medium
                text-theme-secondary`)}
            >
              {selectedCount} item{selectedCount === 1 ? '' : 's'} selected
            </span>
          </div>

          <div className={classNames('flex items-center gap-3')}>
            <Button color="red" onClick={handleUnselectAll} size="small">
              Unselect all
            </Button>

            <Button color="green" onClick={handleDownload} size="small">
              Download
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionFlyout;
