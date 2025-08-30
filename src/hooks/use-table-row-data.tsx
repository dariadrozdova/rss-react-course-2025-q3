import { useMemo } from "react";

import type { TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils";

const formatNumber = (value: null | number | undefined): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return value.toLocaleString("en-US");
};

const formatDecimal = (value: null | number | undefined): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return value.toFixed(2);
};

const formatYear = (value: null | number | undefined): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return value.toString();
};

const formatValue = (
  columnKey: string,
  value: null | number | string | undefined,
): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (typeof value === "string") {
    return value;
  }

  if (columnKey === "year") {
    return formatYear(value);
  }

  if (
    columnKey.includes("per_capita") ||
    columnKey.includes("per_gdp") ||
    columnKey === "temperature_change_from_co2"
  ) {
    return formatDecimal(value);
  }

  return formatNumber(value);
};

interface UseTableRowDataProps {
  allColumns: string[];
  changedFields: string[];
  rowData: TableRowData;
}

export const useTableRowData = ({
  allColumns,
  changedFields,
  rowData,
}: UseTableRowDataProps): {
  cells: {
    className: string;
    formattedValue: string;
    key: string;
    title: string;
  }[];
} => {
  const baseCellClasses = "text-sm text-slate-300 truncate min-w-0";

  const cells = useMemo(() => {
    return allColumns.map((columnKey) => {
      const indexableRowData: Record<
        string,
        null | number | string | undefined
      > = rowData;

      const value = indexableRowData[columnKey];

      const formattedValue = formatValue(columnKey, value);
      const isChanged = changedFields.includes(columnKey);
      const highlightedClasses = isChanged ? "text-highlight-changed" : "";

      let alignmentClasses = classNames(
        baseCellClasses,
        "font-mono text-right",
        highlightedClasses,
      );

      switch (columnKey) {
        case "country": {
          alignmentClasses = classNames(
            baseCellClasses,
            "font-medium text-slate-100 transition-all duration-300 hover:text-neon-300",
            highlightedClasses,
          );
          break;
        }
        case "iso_code": {
          alignmentClasses = classNames(
            baseCellClasses,
            "text-azure-400 text-center font-mono",
            highlightedClasses,
          );
          break;
        }
        case "year": {
          alignmentClasses = classNames(
            baseCellClasses,
            "text-electric-400 text-center font-medium",
            highlightedClasses,
          );
          break;
        }
      }

      return {
        className: alignmentClasses,
        formattedValue,
        key: columnKey,
        title: formattedValue,
      };
    });
  }, [allColumns, changedFields, rowData, baseCellClasses]);

  return { cells };
};
