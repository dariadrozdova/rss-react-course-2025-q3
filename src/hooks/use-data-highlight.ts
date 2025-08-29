import { useEffect } from "react";

import { useTableState } from "@/contexts/table-context";
import type { TableRowData } from "@/types/co2-data";
import { TWO_SECONDS } from "@/utils/constants";

export const useDataHighlight = (
  currentData: TableRowData[],
): {
  getChangedFields: (rowData: TableRowData) => string[];
} => {
  const { clearHighlight, setPreviousData, state } = useTableState();

  const getChangedFields = (rowData: TableRowData): string[] => {
    if (!state.highlightChanges || state.previousTableData.length === 0) {
      return [];
    }

    const previousRow = state.previousTableData.find(
      (previous) => previous.country === rowData.country,
    );

    if (!previousRow) {
      return [];
    }

    const changedFields: string[] = [];

    for (const key of Object.keys(rowData)) {
      if (key === "country") {
        continue;
      }

      const currentValue = rowData[key];
      const previousValue = previousRow[key];

      if (currentValue !== previousValue) {
        if (key === "co2PerCapita") {
          changedFields.push("co2PerCapita");
        } else if (key === "isoCode") {
          changedFields.push("isoCode");
        } else {
          changedFields.push(key);
        }
      }
    }

    return changedFields;
  };

  useEffect(() => {
    if (currentData.length > 0 && !state.highlightChanges) {
      setPreviousData(currentData);
    }
  }, [currentData, setPreviousData, state.highlightChanges]);

  useEffect(() => {
    if (state.highlightChanges) {
      const timer = setTimeout(() => {
        clearHighlight();
      }, TWO_SECONDS);

      return (): void => {
        clearTimeout(timer);
      };
    }
    return;
  }, [state.highlightChanges, clearHighlight]);

  return {
    getChangedFields,
  };
};
