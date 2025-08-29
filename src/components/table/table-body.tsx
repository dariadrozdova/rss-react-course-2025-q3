import { type FC } from "react";

import { TableRow } from "@/components/table";
import type { TableRowData } from "@/types/co2-data";

interface TableBodyProps {
  allColumns: string[];
  getChangedFields: (rowData: TableRowData) => string[];
  gridTemplateColumns: string;
  minTableWidth: number;
  tableRows: TableRowData[];
}

export const TableBody: FC<TableBodyProps> = ({
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
};
