import { type FC } from "react";

import { TableRow } from "@/components/table";
import type { TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils/class-names";
import { LATEST_YEAR } from "@/utils/constants";

interface TableViewProps {
  hasSearchResults: boolean;
  searchTerm: string;
  selectedYear: number | typeof LATEST_YEAR;
  tableRows: TableRowData[];
  totalRows: number;
}

export const TableView: FC<TableViewProps> = ({
  hasSearchResults,
  searchTerm,
  selectedYear,
  tableRows,
  totalRows,
}) => {
  const containerClasses = classNames(
    "w-full h-full flex flex-col rounded-lg border shadow-2xl",
    "bg-dark-900/90 backdrop-blur-lg border-glow-neon",
    "shadow-neon-500/10 transition-all duration-300",
    "hover:shadow-neon-500/20 hover:border-neon-400",
  );

  const headerClasses = classNames(
    "grid grid-cols-6 gap-4 px-6 py-4",
    "bg-gradient-to-r from-neon-600/30 to-electric-600/30",
    "border-b border-glow-neon backdrop-blur-sm",
    "rounded-t-lg shadow-inner",
  );

  const headerCellClasses = classNames(
    "text-sm font-semibold text-slate-100",
    "uppercase tracking-wider transition-all duration-300",
    "hover:text-neon-300 hover:scale-105 cursor-default",
    "text-glow-neon",
  );

  const headerCellCenteredClasses = classNames(
    headerCellClasses,
    "text-center",
  );
  const headerCellRightClasses = classNames(headerCellClasses, "text-right");

  const bodyClasses = classNames(
    "flex-1 overflow-y-auto",
    "scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-neon-600",
    "hover:scrollbar-thumb-neon-500",
  );

  const emptyStateClasses = classNames(
    "flex items-center justify-center py-12",
    "text-slate-400 text-center",
  );

  const footerClasses = classNames(
    "border-glass-border border-t px-6 py-3",
    "bg-dark-800/50 rounded-b-lg",
    "text-center text-xs text-slate-400",
    "flex justify-between items-center",
  );

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <div className={headerCellClasses}>Country</div>
        <div className={headerCellRightClasses}>Population</div>
        <div className={headerCellCenteredClasses}>ISO Code</div>
        <div className={headerCellCenteredClasses}>Year</div>
        <div className={headerCellRightClasses}>CO₂ (t)</div>
        <div className={headerCellRightClasses}>CO₂ per Capita</div>
      </div>

      <div className={bodyClasses}>
        {tableRows.length > 0 ? (
          tableRows.map((row, index) => (
            <TableRow
              isEven={index % 2 === 0}
              key={`${row.country}-${row.year}`}
              rowData={row}
            />
          ))
        ) : (
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
        )}
      </div>

      {tableRows.length > 0 && (
        <div className={footerClasses}>
          <span>
            Showing {tableRows.length.toLocaleString()} of{" "}
            {totalRows.toLocaleString()} countries
          </span>
          <span>
            Year:{" "}
            {selectedYear === LATEST_YEAR ? "Latest Available" : selectedYear}
          </span>
        </div>
      )}
    </div>
  );
};
