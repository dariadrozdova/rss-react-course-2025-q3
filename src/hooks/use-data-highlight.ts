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

    if (previousRow.population !== rowData.population) {
      changedFields.push("population");
    }
    if (previousRow.year !== rowData.year) {
      changedFields.push("year");
    }
    if (previousRow.co2 !== rowData.co2) {
      changedFields.push("co2");
    }
    if (previousRow.co2PerCapita !== rowData.co2PerCapita) {
      changedFields.push("co2PerCapita");
    }
    if (previousRow.isoCode !== rowData.isoCode) {
      changedFields.push("isoCode");
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
