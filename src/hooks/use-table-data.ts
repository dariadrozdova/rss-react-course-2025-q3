import { useEffect } from "react";

import { useTableState } from "@/contexts/table-context";
import { useDataHighlight } from "@/hooks/use-data-highlight";
import type { ProcessedCountryData, TableRowData } from "@/types/co2-data";
import { LATEST_YEAR } from "@/utils/constants";

export const useTableData = (
  countries: ProcessedCountryData[],
): {
  getChangedFields: (rowData: TableRowData) => string[];
  hasSearchResults: boolean;
  searchTerm: string;
  selectedYear: null | number;
  tableRows: TableRowData[];
  totalRows: number;
} => {
  const { setAvailableYears, state } = useTableState();

  useEffect(() => {
    const allYears = new Set<number>();
    for (const country of countries) {
      for (const yearData of country.data) {
        allYears.add(yearData.year);
      }
    }
    const yearsArray = [...allYears];
    setAvailableYears(yearsArray);
  }, [countries, setAvailableYears]);

  const createTableRows = (): TableRowData[] => {
    const rows: TableRowData[] = [];

    for (const country of countries) {
      const yearData =
        state.selectedYear === LATEST_YEAR
          ? country.data.reduce((latest, current) =>
              current.year > latest.year ? current : latest,
            )
          : country.data.find((d) => d.year === state.selectedYear);

      if (!yearData) {
        continue;
      }

      rows.push({
        co2: yearData.co2 ?? null,
        co2PerCapita: yearData.co2_per_capita ?? null,
        country: country.country,
        isoCode: country.isoCode,
        population: yearData.population ?? null,
        year: yearData.year,
      });
    }

    return rows;
  };

  const filterRows = (rows: TableRowData[]): TableRowData[] => {
    if (state.searchTerm.trim() === "") {
      return rows;
    }

    return rows.filter((row) =>
      row.country.toLowerCase().includes(state.searchTerm.toLowerCase()),
    );
  };

  const sortRows = (rows: TableRowData[]): TableRowData[] => {
    if (!state.sortBy) {
      return rows;
    }

    const sortedRows = [...rows];

    sortedRows.sort((a, b) => {
      let aValue, bValue;

      if (state.sortBy === "name") {
        aValue = a.country.toLowerCase();
        bValue = b.country.toLowerCase();
      } else if (state.sortBy === "population") {
        aValue = a.population ?? 0;
        bValue = b.population ?? 0;
      } else {
        return 0;
      }

      if (aValue < bValue) {
        return state.sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return state.sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortedRows;
  };

  const baseRows = createTableRows();
  const filteredRows = filterRows(baseRows);
  const finalRows = sortRows(filteredRows);

  const { getChangedFields } = useDataHighlight(finalRows);

  return {
    getChangedFields,
    hasSearchResults: state.searchTerm.trim() !== "",
    searchTerm: state.searchTerm,
    selectedYear: state.selectedYear,
    tableRows: finalRows,
    totalRows: baseRows.length,
  };
};
