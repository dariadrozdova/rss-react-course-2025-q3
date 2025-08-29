import type { FC } from "react";

import type { TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils";

interface TableRowProps {
  allColumns: string[];
  changedFields: string[];
  gridTemplateColumns: string;
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

const formatValue = (columnKey: string, value: null | number): string => {
  if (value === null) {
    return "N/A";
  }

  if (columnKey === "country" || columnKey === "iso_code") {
    return String(value);
  }

  if (columnKey === "year") {
    return String(value);
  }

  if (
    columnKey.includes("co2") ||
    columnKey === "methane" ||
    columnKey === "gdp"
  ) {
    return formatNumber(value);
  }

  if (
    columnKey.includes("per_capita") ||
    columnKey.includes("per_gdp") ||
    columnKey === "temperature_change_from_co2"
  ) {
    return formatDecimal(value);
  }

  if (typeof value === "number") {
    return formatNumber(value);
  }

  return value;
};

export const TableRow: FC<TableRowProps> = ({
  allColumns,
  changedFields,
  gridTemplateColumns,
  isEven,
  rowData,
}) => {
  const rowClasses = classNames(
    "grid gap-4 px-6 py-3",
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

  const getCellAlignment = (columnKey: string): string => {
    if (columnKey === "country") {
      return classNames(
        baseCellClasses,
        "font-medium text-slate-100",
        "transition-all duration-300 hover:text-neon-300",
        getHighlightedTextClasses("country"),
      );
    }

    if (columnKey === "iso_code") {
      return classNames(
        baseCellClasses,
        "text-azure-400 text-center font-mono",
        getHighlightedTextClasses("isoCode"),
      );
    }

    if (columnKey === "year") {
      return classNames(
        baseCellClasses,
        "text-electric-400 text-center font-medium",
        getHighlightedTextClasses("year"),
      );
    }

    return classNames(
      baseCellClasses,
      "font-mono text-right",
      getHighlightedTextClasses(columnKey),
    );
  };

  const getCellValue = (columnKey: string): null | number | string => {
    if (columnKey === "country") {
      return rowData.country;
    }
    if (columnKey === "iso_code") {
      return rowData.isoCode;
    }
    if (columnKey === "year") {
      return rowData.year;
    }
    if (columnKey === "population") {
      return rowData.population;
    }
    if (columnKey === "co2") {
      return rowData.co2;
    }
    if (columnKey === "co2_per_capita") {
      return rowData.co2PerCapita;
    }

    const value = rowData[columnKey];
    return value ?? null;
  };

  return (
    <div
      className={rowClasses}
      style={{
        gridTemplateColumns,
      }}
    >
      {allColumns.map((columnKey) => {
        const value = getCellValue(columnKey);
        const formattedValue = formatValue(columnKey, value);

        return (
          <div
            className={getCellAlignment(columnKey)}
            key={columnKey}
            title={formattedValue}
          >
            {formattedValue}
          </div>
        );
      })}
    </div>
  );
};
