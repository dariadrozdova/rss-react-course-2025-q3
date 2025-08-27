import type { FC } from "react";

import type { TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils";

interface TableRowProps {
  isEven: boolean;
  rowData: TableRowData;
}

const formatNumber = (value: null | number): string => {
  if (value === null) {
    return "N/A";
  }
  return value.toLocaleString();
};

const formatDecimal = (value: null | number): string => {
  if (value === null) {
    return "N/A";
  }
  return value.toFixed(2);
};

export const TableRow: FC<TableRowProps> = ({ isEven, rowData }) => {
  const rowClasses = classNames(
    "grid grid-cols-6 gap-4 px-6 py-3",
    "hover:bg-neon-500/10 hover:shadow-sm hover:shadow-neon-500/20",
    "transition-all duration-300 cursor-pointer",
    "hover:border-l-4 hover:border-l-neon-500",
    isEven ? "bg-dark-800/30" : "bg-dark-900/30",
    "min-w-full",
  );

  const cellClasses = classNames(
    "text-sm text-slate-300",
    "truncate",
    "min-w-0",
  );

  const countryCellClasses = classNames(
    cellClasses,
    "font-medium text-slate-100",
    "transition-all duration-300 hover:text-neon-300",
  );

  const numericCellClasses = classNames(cellClasses, "font-mono text-right");

  return (
    <div className={rowClasses}>
      <div className={countryCellClasses}>{rowData.country}</div>

      <div className={numericCellClasses}>
        {formatNumber(rowData.population)}
      </div>

      <div
        className={classNames(
          cellClasses,
          "text-azure-400 text-center font-mono",
        )}
      >
        {rowData.isoCode ?? "N/A"}
      </div>

      <div
        className={classNames(
          cellClasses,
          "text-electric-400 text-center font-medium",
        )}
      >
        {rowData.year}
      </div>

      <div className={numericCellClasses}>{formatNumber(rowData.co2)}</div>

      <div className={numericCellClasses}>
        {formatDecimal(rowData.co2PerCapita)}
      </div>
    </div>
  );
};
