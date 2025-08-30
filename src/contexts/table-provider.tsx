import {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useReducer,
} from "react";

import { TableContext } from "@/contexts/table-context";
import {
  initialTableState,
  type TableState,
  tableStateReducer,
} from "@/reducers/table-reducer";
import type { TableRowData } from "@/types/co2-data";
import type { LATEST_YEAR } from "@/utils/constants";

interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider: FC<TableProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(tableStateReducer, initialTableState);

  const setYear = useCallback((year: number | typeof LATEST_YEAR): void => {
    dispatch({ payload: year, type: "SET_YEAR" });
  }, []);

  const setSearch = useCallback((term: string): void => {
    dispatch({ payload: term, type: "SET_SEARCH" });
  }, []);

  const setSort = useCallback(
    (
      sortBy: TableState["sortBy"],
      direction: TableState["sortDirection"] = "asc",
    ): void => {
      dispatch({ payload: { direction, sortBy }, type: "SET_SORT" });
    },
    [],
  );

  const toggleColumn = useCallback((column: string): void => {
    dispatch({ payload: column, type: "TOGGLE_COLUMN" });
  }, []);

  const setAvailableYears = useCallback((years: number[]): void => {
    dispatch({ payload: years, type: "SET_AVAILABLE_YEARS" });
  }, []);

  const resetFilters = useCallback((): void => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const setPreviousData = useCallback((data: TableRowData[]): void => {
    dispatch({ payload: data, type: "SET_PREVIOUS_DATA" });
  }, []);

  const clearHighlight = useCallback((): void => {
    dispatch({ type: "CLEAR_HIGHLIGHT" });
  }, []);

  const value = useMemo(
    () => ({
      clearHighlight,
      resetFilters,
      setAvailableYears,
      setPreviousData,
      setSearch,
      setSort,
      setYear,
      state,
      toggleColumn,
    }),
    [
      clearHighlight,
      resetFilters,
      setAvailableYears,
      setPreviousData,
      setSearch,
      setSort,
      setYear,
      state,
      toggleColumn,
    ],
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
