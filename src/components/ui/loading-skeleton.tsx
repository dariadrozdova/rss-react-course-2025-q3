import type { FC } from "react";

import { classNames } from "@/utils/class-names";

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({ className }) => {
  const skeletonClasses = classNames(
    "animate-pulse bg-gradient-to-r from-dark-700 via-dark-600 to-dark-700",
    "bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
    "h-4 rounded",
    className,
  );

  return <div className={skeletonClasses} />;
};
