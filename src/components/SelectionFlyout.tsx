import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
} from '@store/selectors';
import { unselectAllItems } from '@store/slices/selectedItemsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import Button from '@components/Button';

import { useTheme } from '@/context/ThemeContext';

const SelectionFlyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);
  const selectedCount = useAppSelector(selectSelectedItemsCount);
  const { isDark } = useTheme();
  const downloadLinkReference = useRef<HTMLAnchorElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const handleUnselectAll = () => {
    dispatch(unselectAllItems());
  };

  const handleDownload = () => {
    const csvHeaders = ['ID', 'Name', 'Image URL', 'Details URL'];
    const csvRows = selectedItems.map((item) => [
      item.id.toString(),
      `"${item.name}"`,
      `"${item.imageUrl || ''}"`,
      `"${window.location.origin}/pokemon/${item.id}"`,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    setDownloadUrl(url);

    setTimeout(() => {
      downloadLinkReference.current?.click();
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`
          fixed bottom-0 left-0 right-0 z-[9999] p-3 shadow-2xl border-t
          ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}
        `}
        exit={{ opacity: 0, y: 100 }}
        initial={{ opacity: 0, y: 100 }}
        style={{
          height: '72px',
          pointerEvents: 'auto',
        }}
        transition={{ damping: 30, stiffness: 300, type: 'spring' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center">
            <span
              className={`
                text-sm font-medium
                ${isDark ? 'text-gray-200' : 'text-gray-700'}
              `}
            >
              {selectedCount} item{selectedCount === 1 ? '' : 's'} selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button color="red" onClick={handleUnselectAll} size="small">
              Unselect all
            </Button>

            <Button color="green" onClick={handleDownload} size="small">
              Download
            </Button>

            <a
              aria-hidden="true"
              download={`${selectedCount}_items.csv`}
              href={downloadUrl}
              ref={downloadLinkReference}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionFlyout;
