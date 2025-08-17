'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import Button from '@/components/Button';
import { useDownload } from '@/hooks/useDownload';
import { useAppDispatch } from '@/store/hooks';
import { unselectAllItems } from '@/store/slices/selectedItemsSlice';
import { classNames } from '@/utils/classNames';

const SelectionFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { handleDownload, selectedCount } = useDownload();

  const handleUnselectAll = () => {
    dispatch(unselectAllItems());
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={classNames(
          'fixed bottom-0 left-0 right-0 z-[9999] p-3 shadow-2xl border-t',
          'bg-theme-secondary border-theme'
        )}
        exit={{ opacity: 0, y: 100 }}
        initial={{ opacity: 0, y: 100 }}
        style={{
          height: '5rem',
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
              className={classNames('text-sm font-medium text-theme-secondary')}
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
