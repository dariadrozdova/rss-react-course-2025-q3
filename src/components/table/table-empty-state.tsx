import { type FC } from "react";

import { classNames } from "@/utils/class-names";
import { LATEST_YEAR } from "@/utils/constants";

interface TableEmptyStateProps {
  hasSearchResults: boolean;
  searchTerm: string;
  selectedYear: number | typeof LATEST_YEAR;
}

export const TableEmptyState: FC<TableEmptyStateProps> = ({
  hasSearchResults,
  searchTerm,
  selectedYear,
}) => {
  const emptyStateClasses = classNames(
    "flex items-center justify-center py-12",
    "text-slate-400 text-center",
  );

  return (
    <div className={emptyStateClasses}>
      <div>
        <p className="mb-2 text-lg font-medium">No data found</p>
        <p className="text-sm">
          {hasSearchResults
            ? `No countries found matching "${searchTerm}"`
            : `No data available for ${selectedYear === LATEST_YEAR ? "latest year" : selectedYear}`}
        </p>
      </div>
    </div>
  );
};
