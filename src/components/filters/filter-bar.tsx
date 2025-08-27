import { type FC } from "react";

import { SearchBar, SortControls, YearSelector } from "@/components/filters";
import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils";

export const FilterBar: FC = () => {
  const { resetFilters } = useTableState();

  const containerClasses = classNames(
    "bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 mb-6",
    "border border-glow-neon/30 shadow-lg shadow-neon-500/5",
  );

  const resetButtonClasses = classNames(
    "px-4 py-2 text-sm bg-slate-600/30 hover:bg-slate-600/50",
    "border border-slate-500/30 rounded-md text-slate-300",
    "transition-all duration-200 hover:text-slate-200",
    "self-start",
  );

  return (
    <div className={containerClasses}>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <YearSelector />
        <SearchBar />
        <SortControls />
      </div>
      <div className="flex justify-end">
        <button className={resetButtonClasses} onClick={resetFilters}>
          Reset All Filters
        </button>
      </div>
    </div>
  );
};
