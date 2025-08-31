import { type FC, memo, useMemo } from "react";

import {
  TableBody,
  TableContainer,
  TableEmptyState,
  TableHeader,
} from "@/components/table";
import { useTableState } from "@/contexts/table-context";
import type { TableRowData } from "@/types/emissions-data";
import { LATEST_YEAR } from "@/utils/constants";

interface TableViewProps {
  getChangedFields: (rowData: TableRowData) => string[];
  hasSearchResults: boolean;
  searchTerm: string;
  selectedYear: number | typeof LATEST_YEAR;
  tableRows: TableRowData[];
  totalRows: number;
}

export const TableView: FC<TableViewProps> = memo(
  ({
    getChangedFields,
    hasSearchResults,
    searchTerm,
    selectedYear,
    tableRows,
  }) => {
    const { state } = useTableState();

    const { allColumns, gridTemplateColumns, minTableWidth } = useMemo(() => {
      const fixedColumns = ["country", "iso_code"];
      const selectedDataColumns = state.selectedColumns;
      const allColumns = [...fixedColumns, ...selectedDataColumns];
      const totalColumns = allColumns.length;

      const minColumnWidth = 140;
      const gridTemplateColumns = `repeat(${totalColumns}, minmax(${minColumnWidth}px, 1fr))`;
      const minTableWidth = totalColumns * minColumnWidth;

      return {
        allColumns,
        gridTemplateColumns,
        minTableWidth,
      };
    }, [state.selectedColumns]);

    return (
      <TableContainer>
        <TableHeader
          allColumns={allColumns}
          gridTemplateColumns={gridTemplateColumns}
        />

        {tableRows.length > 0 ? (
          <TableBody
            allColumns={allColumns}
            getChangedFields={getChangedFields}
            gridTemplateColumns={gridTemplateColumns}
            minTableWidth={minTableWidth}
            tableRows={tableRows}
          />
        ) : (
          <TableEmptyState
            hasSearchResults={hasSearchResults}
            searchTerm={searchTerm}
            selectedYear={selectedYear}
          />
        )}
      </TableContainer>
    );
  },
);

TableView.displayName = "TableView";
