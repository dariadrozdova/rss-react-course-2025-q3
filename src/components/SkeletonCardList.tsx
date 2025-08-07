import React from 'react';

import { cn } from '@utils/cn';

interface Props {
  count?: number;
}

const SkeletonCardList: React.FC<Props> = ({ count = 20 }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4'
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          className={cn('bg-gray-200 animate-pulse h-[180px] rounded-md')}
          key={index}
        />
      ))}
    </div>
  );
};

export default SkeletonCardList;
