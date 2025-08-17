'use client';

import { useAppSelector } from '@/store/hooks';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
} from '@/store/selectors';

export const useDownload = () => {
  const selectedItems = useAppSelector(selectSelectedItems);
  const selectedCount = useAppSelector(selectSelectedItemsCount);

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

  return { handleDownload, selectedCount };
};
