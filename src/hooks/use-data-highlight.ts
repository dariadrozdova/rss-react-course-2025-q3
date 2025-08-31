import { useCallback, useEffect, useRef } from "react";

import { useTableState } from "@/contexts/table-context";
import type { TableRowData } from "@/types/emissions-data";
import { TWO_SECONDS } from "@/utils/constants";

export const useDataHighlight = (
  currentData: TableRowData[],
): {
  getChangedFields: (rowData: TableRowData) => string[];
} => {
  const { clearHighlight, setPreviousData, state } = useTableState();

  const getChangedFields = useCallback(
    (rowData: TableRowData): string[] => {
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
    },
    [state.highlightChanges, state.previousTableData],
  );

  const initialized = useRef(false);
  const previousDataReference = useRef<TableRowData[]>([]);

  useEffect(() => {
    if (initialized.current && currentData.length > 0) {
      const dataChanged =
        JSON.stringify(previousDataReference.current) !==
        JSON.stringify(currentData);
      if (dataChanged) {
        setPreviousData(previousDataReference.current);
      }
    }

    previousDataReference.current = currentData;

    if (!initialized.current && currentData.length > 0) {
      initialized.current = true;
    }
  }, [currentData, setPreviousData]);

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
