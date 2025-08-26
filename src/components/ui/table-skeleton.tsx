import type { FC } from "react";

import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { classNames } from "@/utils/class-names";

export const TableSkeleton: FC = () => {
  const containerClasses = classNames(
    "w-full rounded-lg border",
    "bg-dark-900/90 backdrop-blur-lg border-glass-border",
    "p-6",
  );

  const headerClasses = classNames(
    "grid grid-cols-6 gap-4 mb-4 pb-3",
    "border-b border-electric-400/20",
  );

  const rowClasses = classNames("grid grid-cols-6 gap-4 mb-3");

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton className="h-5" key={`header-${index}`} />
        ))}
      </div>

      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div className={rowClasses} key={`row-${rowIndex}`}>
          {Array.from({ length: 6 }).map((_, colIndex) => (
            <LoadingSkeleton
              className="h-4"
              key={`cell-${rowIndex}-${colIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
