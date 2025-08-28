import type { FC } from "react";

import type { TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils";

interface TableRowProps {
  changedFields: string[];
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

export const TableRow: FC<TableRowProps> = ({
  changedFields,
  isEven,
  rowData,
}) => {
  const rowClasses = classNames(
    "grid grid-cols-6 gap-4 px-6 py-3",
    "hover:bg-neon-500/10 hover:shadow-sm hover:shadow-neon-500/20",
    "transition-all duration-300 cursor-pointer",
    "hover:border-l-4 hover:border-l-neon-500",
    isEven ? "bg-dark-800/30" : "bg-dark-900/30",
    "min-w-full",
  );

  const baseCellClasses = classNames(
    "text-sm text-slate-300",
    "truncate",
    "min-w-0",
  );

  const getHighlightedTextClasses = (fieldName: string): string => {
    return changedFields.includes(fieldName) ? "text-highlight-changed" : "";
  };

  const countryCellClasses = classNames(
    baseCellClasses,
    "font-medium text-slate-100",
    "transition-all duration-300 hover:text-neon-300",
    getHighlightedTextClasses("country"),
  );

  const populationCellClasses = classNames(
    baseCellClasses,
    "font-mono text-right",
    getHighlightedTextClasses("population"),
  );

  const isoCodeCellClasses = classNames(
    baseCellClasses,
    "text-azure-400 text-center font-mono",
    getHighlightedTextClasses("isoCode"),
  );

  const yearCellClasses = classNames(
    baseCellClasses,
    "text-electric-400 text-center font-medium",
    getHighlightedTextClasses("year"),
  );

  const co2CellClasses = classNames(
    baseCellClasses,
    "font-mono text-right",
    getHighlightedTextClasses("co2"),
  );

  const co2PerCapitaCellClasses = classNames(
    baseCellClasses,
    "font-mono text-right",
    getHighlightedTextClasses("co2PerCapita"),
  );

  return (
    <div className={rowClasses}>
      <div className={countryCellClasses}>{rowData.country}</div>

      <div className={populationCellClasses}>
        {formatNumber(rowData.population)}
      </div>

      <div className={isoCodeCellClasses}>{rowData.isoCode ?? "N/A"}</div>

      <div className={yearCellClasses}>{rowData.year}</div>

      <div className={co2CellClasses}>{formatNumber(rowData.co2)}</div>

      <div className={co2PerCapitaCellClasses}>
        {formatDecimal(rowData.co2PerCapita)}
      </div>
    </div>
  );
};
