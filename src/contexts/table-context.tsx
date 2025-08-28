import { createContext, useContext } from "react";

import type { TableState } from "@/reducers/table-reducer";
import type { TableRowData } from "@/types/co2-data";
import type { LATEST_YEAR } from "@/utils/constants";

interface TableContextValue {
  clearHighlight: () => void;
  resetFilters: () => void;
  setAvailableYears: (years: number[]) => void;
  setPreviousData: (data: TableRowData[]) => void;
  setSearch: (term: string) => void;
  setSort: (
    sortBy: TableState["sortBy"],
    direction?: TableState["sortDirection"],
  ) => void;
  setYear: (year: number | typeof LATEST_YEAR) => void;
  state: TableState;
  toggleColumn: (column: string) => void;
}

export const TableContext = createContext<null | TableContextValue>(null);

export const useTableState = (): TableContextValue => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableState must be used within TableProvider");
  }
  return context;
};
