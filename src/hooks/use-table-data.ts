import { useCallback, useEffect, useMemo } from "react";

import { useTableState } from "@/contexts/table-context";
import { useDataHighlight } from "@/hooks/use-data-highlight";
import type {
  ProcessedCountryData,
  TableRowData,
  YearlyData,
} from "@/types/emissions-data";
import { LATEST_YEAR } from "@/utils/constants";

const getLatestYearData = (
  countryData: ProcessedCountryData["data"],
): YearlyData => {
  let latestData = countryData[0];
  for (const current of countryData) {
    if (current.year > latestData.year) {
      latestData = current;
    }
  }
  return latestData;
};

const createTableRow = (
  country: ProcessedCountryData,
  yearData: ProcessedCountryData["data"][0],
): TableRowData => {
  const baseRow: TableRowData = {
    co2: yearData.co2 ?? null,
    co2_per_capita: yearData.co2_per_capita ?? null,
    country: country.country,
    iso_code: country.isoCode,
    population: yearData.population ?? null,
    year: yearData.year,
  };

  const extendedRow = { ...baseRow };

  for (const key of Object.keys(yearData)) {
    if (!(key in extendedRow) && key !== "year") {
      extendedRow[key] = yearData[key] ?? null;
    }
  }

  return extendedRow;
};

const sortByPopulation = (
  a: TableRowData,
  b: TableRowData,
  direction: "asc" | "desc",
): number => {
  const aValue = a.population;
  const bValue = b.population;

  if (aValue === null && bValue === null) {
    return 0;
  }
  if (aValue === null) {
    return 1;
  }
  if (bValue === null) {
    return -1;
  }

  return direction === "asc" ? aValue - bValue : bValue - aValue;
};

const sortByName = (
  a: TableRowData,
  b: TableRowData,
  direction: "asc" | "desc",
): number => {
  const aValue = a.country.toLowerCase();
  const bValue = b.country.toLowerCase();

  if (aValue < bValue) {
    return direction === "asc" ? -1 : 1;
  }
  if (aValue > bValue) {
    return direction === "asc" ? 1 : -1;
  }
  return 0;
};

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

  const availableYears = useMemo(() => {
    const allYears = new Set<number>();
    for (const country of countries) {
      for (const yearData of country.data) {
        allYears.add(yearData.year);
      }
    }
    return [...allYears];
  }, [countries]);

  useEffect(() => {
    setAvailableYears(availableYears);
  }, [availableYears, setAvailableYears]);

  const baseRows = useMemo((): TableRowData[] => {
    const rows: TableRowData[] = [];

    for (const country of countries) {
      const yearData: undefined | YearlyData =
        state.selectedYear === LATEST_YEAR
          ? getLatestYearData(country.data)
          : country.data.find((d) => d.year === state.selectedYear);

      if (yearData) {
        rows.push(createTableRow(country, yearData));
      }
    }

    return rows;
  }, [countries, state.selectedYear]);

  const filterRows = useCallback(
    (rows: TableRowData[]): TableRowData[] => {
      if (state.searchTerm.trim() === "") {
        return rows;
      }

      const searchLower = state.searchTerm.toLowerCase();
      return rows.filter((row) =>
        row.country.toLowerCase().includes(searchLower),
      );
    },
    [state.searchTerm],
  );

  const sortRows = useCallback(
    (rows: TableRowData[]): TableRowData[] => {
      if (!state.sortBy) {
        return rows;
      }

      const sortedRows = [...rows];
      sortedRows.sort((a, b) => {
        if (state.sortBy === "population") {
          return sortByPopulation(a, b, state.sortDirection);
        }
        if (state.sortBy === "name") {
          return sortByName(a, b, state.sortDirection);
        }
        return 0;
      });

      return sortedRows;
    },
    [state.sortBy, state.sortDirection],
  );

  const filteredRows = useMemo(() => {
    return filterRows(baseRows);
  }, [baseRows, filterRows]);

  const finalRows = useMemo(() => {
    return sortRows(filteredRows);
  }, [filteredRows, sortRows]);

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
