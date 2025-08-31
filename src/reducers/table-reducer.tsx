import type { TableRowData } from "@/types/co2-data";
import { LATEST_YEAR } from "@/utils/constants";

export interface TableState {
  availableYears: number[];
  highlightChanges: boolean;
  previousTableData: TableRowData[];
  searchTerm: string;
  selectedColumns: string[];
  selectedYear: number | typeof LATEST_YEAR;
  sortBy: "name" | "population" | null;
  sortDirection: "asc" | "desc";
}

export type TableAction =
  | { payload: number[]; type: "SET_AVAILABLE_YEARS" }
  | { payload: number | typeof LATEST_YEAR; type: "SET_YEAR" }
  | { payload: string; type: "SET_SEARCH" }
  | { payload: string; type: "TOGGLE_COLUMN" }
  | { payload: TableRowData[]; type: "SET_PREVIOUS_DATA" }
  | {
      payload: {
        direction: TableState["sortDirection"];
        sortBy: TableState["sortBy"];
      };
      type: "SET_SORT";
    }
  | { type: "CLEAR_HIGHLIGHT" }
  | { type: "RESET_FILTERS" };

export const initialTableState: TableState = {
  availableYears: [],
  highlightChanges: false,
  previousTableData: [],
  searchTerm: "",
  selectedColumns: ["year", "population", "co2", "co2_per_capita"],
  selectedYear: LATEST_YEAR,
  sortBy: null,
  sortDirection: "asc",
};

export const tableStateReducer = (
  state: TableState,
  action: TableAction,
): TableState => {
  switch (action.type) {
    case "CLEAR_HIGHLIGHT": {
      return {
        ...state,
        highlightChanges: false,
      };
    }

    case "RESET_FILTERS": {
      return {
        ...state,
        highlightChanges: false,
        previousTableData: [],
        searchTerm: "",
        selectedYear: state.availableYears[0] || LATEST_YEAR,
        sortBy: null,
        sortDirection: "asc",
      };
    }

    case "SET_AVAILABLE_YEARS": {
      const sortedYears = [...action.payload].sort((a, b) => b - a);
      return {
        ...state,
        availableYears: sortedYears,
        selectedYear:
          state.selectedYear === LATEST_YEAR && sortedYears.length > 0
            ? sortedYears[0]
            : state.selectedYear,
      };
    }

    case "SET_PREVIOUS_DATA": {
      return {
        ...state,
        previousTableData: action.payload,
      };
    }

    case "SET_SEARCH": {
      return { ...state, searchTerm: action.payload };
    }

    case "SET_SORT": {
      const newDirection =
        state.sortBy === action.payload.sortBy && state.sortDirection === "asc"
          ? "desc"
          : action.payload.direction;

      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: newDirection,
      };
    }

    case "SET_YEAR": {
      return {
        ...state,
        highlightChanges: true,
        selectedYear: action.payload,
      };
    }

    case "TOGGLE_COLUMN": {
      const columnExists = state.selectedColumns.includes(action.payload);
      return {
        ...state,
        selectedColumns: columnExists
          ? state.selectedColumns.filter((col) => col !== action.payload)
          : [...state.selectedColumns, action.payload],
      };
    }

    default: {
      return state;
    }
  }
};
