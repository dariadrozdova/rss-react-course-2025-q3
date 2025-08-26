import type { FC } from "react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { classNames } from "@/utils/class-names";

interface DataLoadingFallbackProps {
  message?: string;
}

export const DataLoadingFallback: FC<DataLoadingFallbackProps> = ({
  message = "Loading CO2 emissions data...",
}) => {
  const containerClasses = classNames(
    "flex flex-col items-center justify-center",
    "min-h-md space-y-6",
  );

  const textClasses = classNames(
    "text-lg font-medium text-slate-300",
    "animate-pulse",
  );

  const descriptionClasses = classNames(
    "text-sm text-slate-400 text-center max-w-md",
  );

  return (
    <div className={containerClasses}>
      <LoadingSpinner size="lg" />
      <div className="space-y-2 text-center">
        <p className={textClasses}>{message}</p>
        <p className={descriptionClasses}>
          Fetching and processing large dataset (~100MB). This may take a
          moment...
        </p>
      </div>
      <TableSkeleton />
    </div>
  );
};
