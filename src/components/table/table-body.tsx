import { type FC, memo } from "react";

import { TableRow } from "@/components/table";
import type { TableRowData } from "@/types/emissions-data";

interface TableBodyProps {
  allColumns: string[];
  getChangedFields: (rowData: TableRowData) => string[];
  gridTemplateColumns: string;
  minTableWidth: number;
  tableRows: TableRowData[];
}

export const TableBody: FC<TableBodyProps> = memo(
  ({
    allColumns,
    getChangedFields,
    gridTemplateColumns,
    minTableWidth,
    tableRows,
  }) => {
    return (
      <div style={{ minWidth: `${minTableWidth}px` }}>
        {tableRows.map((row, index) => (
          <TableRow
            allColumns={allColumns}
            changedFields={getChangedFields(row)}
            gridTemplateColumns={gridTemplateColumns}
            isEven={index % 2 === 0}
            key={`${row.country}-${row.year}`}
            rowData={row}
          />
        ))}
      </div>
    );
  },
);

TableBody.displayName = "TableBody";
