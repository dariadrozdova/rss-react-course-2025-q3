import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useReducer,
} from "react";

import {
  initialTableState,
  type TableState,
  tableStateReducer,
} from "@/reducers/table-reducer";
import type { LATEST_YEAR } from "@/utils/constants";

interface TableContextValue {
  resetFilters: () => void;
  setAvailableYears: (years: number[]) => void;
  setSearch: (term: string) => void;
  setSort: (
    sortBy: TableState["sortBy"],
    direction?: TableState["sortDirection"],
  ) => void;
  setYear: (year: number | typeof LATEST_YEAR) => void;
  state: TableState;
  toggleColumn: (column: string) => void;
}

const TableContext = createContext<null | TableContextValue>(null);

export const useTableState = (): TableContextValue => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableState must be used within TableProvider");
  }
  return context;
};

interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider: FC<TableProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(tableStateReducer, initialTableState);

  const setYear = (year: number | typeof LATEST_YEAR): void => {
    dispatch({ payload: year, type: "SET_YEAR" });
  };

  const setSearch = (term: string): void => {
    dispatch({ payload: term, type: "SET_SEARCH" });
  };

  const setSort = (
    sortBy: TableState["sortBy"],
    direction: TableState["sortDirection"] = "asc",
  ): void => {
    dispatch({ payload: { direction, sortBy }, type: "SET_SORT" });
  };

  const toggleColumn = (column: string): void => {
    dispatch({ payload: column, type: "TOGGLE_COLUMN" });
  };

  const setAvailableYears = (years: number[]): void => {
    dispatch({ payload: years, type: "SET_AVAILABLE_YEARS" });
  };

  const resetFilters = (): void => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const value: TableContextValue = {
    resetFilters,
    setAvailableYears,
    setSearch,
    setSort,
    setYear,
    state,
    toggleColumn,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
