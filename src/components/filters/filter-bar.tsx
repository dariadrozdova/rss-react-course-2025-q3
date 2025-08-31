import { type FC, memo, useCallback, useState } from "react";

import { SearchBar, SortControls, YearSelector } from "@/components/filters";
import { ColumnSelectorModal } from "@/components/filters/column-selector-modal";
import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils";
import { REQUIRED_COLUMNS_COUNT } from "@/utils/constants";

export const FilterBar: FC = memo(() => {
  const { resetFilters, state } = useTableState();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const handleOpenColumnModal = useCallback(() => {
    setIsColumnModalOpen(true);
  }, []);

  const handleCloseColumnModal = useCallback(() => {
    setIsColumnModalOpen(false);
  }, []);

  const containerClasses = classNames(
    "bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 mb-6",
    "border border-glow-neon/30 shadow-lg shadow-neon-500/5",
  );

  const resetButtonClasses = classNames(
    "px-4 py-2 text-sm bg-slate-600/30 hover:bg-slate-600/50",
    "border border-slate-500/30 rounded-md text-slate-300",
    "transition-all duration-200 hover:text-slate-200 cursor-pointer",
  );

  const columnButtonClasses = classNames(
    "px-4 py-2 text-sm bg-electric-600/30 hover:bg-electric-600/50",
    "border border-electric-500/50 hover:border-electric-400",
    "rounded-md text-electric-300 hover:text-electric-200",
    "transition-all duration-200 cursor-pointer",
    "flex items-center gap-2",
  );

  const selectedColumnsCount =
    state.selectedColumns.length - REQUIRED_COLUMNS_COUNT;

  return (
    <>
      <div className={containerClasses}>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <YearSelector />
          <SearchBar />
          <SortControls />
        </div>
        <div className="flex items-center justify-between">
          <button
            className={columnButtonClasses}
            onClick={handleOpenColumnModal}
          >
            <span>📊</span>
            <span>
              Columns ({state.selectedColumns.length})
              {selectedColumnsCount > 0 && (
                <span className="ml-1 text-xs">
                  +{selectedColumnsCount} extra
                </span>
              )}
            </span>
          </button>
          <button className={resetButtonClasses} onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      </div>

      <ColumnSelectorModal
        isOpen={isColumnModalOpen}
        onClose={handleCloseColumnModal}
      />
    </>
  );
});

FilterBar.displayName = "FilterBar";
