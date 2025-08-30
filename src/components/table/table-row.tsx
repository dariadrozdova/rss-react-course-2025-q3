import { type FC, memo } from "react";

import { useTableRowData } from "@/hooks/use-table-row-data";
import type { TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils";

interface TableRowProps {
  allColumns: string[];
  changedFields: string[];
  gridTemplateColumns: string;
  isEven: boolean;
  rowData: TableRowData;
}

export const TableRow: FC<TableRowProps> = memo(
  ({ allColumns, changedFields, gridTemplateColumns, isEven, rowData }) => {
    const { cells } = useTableRowData({ allColumns, changedFields, rowData });

    const rowClasses = classNames(
      "grid gap-4 px-6 py-3",
      "hover:bg-neon-500/10 hover:shadow-sm hover:shadow-neon-500/20",
      "transition-all duration-300 cursor-pointer",
      "hover:border-l-4 hover:border-l-neon-500",
      isEven ? "bg-dark-800/30" : "bg-dark-900/30",
      "min-w-full",
    );

    return (
      <div
        className={rowClasses}
        style={{
          gridTemplateColumns,
        }}
      >
        {cells.map((cell) => (
          <div className={cell.className} key={cell.key} title={cell.title}>
            {cell.formattedValue}
          </div>
        ))}
      </div>
    );
  },
);

TableRow.displayName = "TableRow";
