import React from 'react';

import { classNames } from '@/utils/classNames';

interface Props {
  count?: number;
}

const SkeletonCardList: React.FC<Props> = ({ count = 20 }) => {
  return (
    <div
      className={classNames(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4'
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          className={classNames('bg-gray-200 animate-pulse h-45 rounded-md')}
          key={index}
        />
      ))}
    </div>
  );
};

export default SkeletonCardList;
