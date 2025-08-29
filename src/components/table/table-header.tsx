import { type FC } from "react";

import { classNames } from "@/utils/class-names";
import { AVAILABLE_COLUMNS } from "@/utils/constants";

interface TableHeaderProps {
  allColumns: string[];
  gridTemplateColumns: string;
}

const getColumnLabel = (columnKey: string): string => {
  const column = AVAILABLE_COLUMNS.find((col) => col.key === columnKey);
  return column?.label ?? columnKey;
};
export const TableHeader: FC<TableHeaderProps> = ({
  allColumns,
  gridTemplateColumns,
}) => {
  const headerClasses = classNames(
    `grid gap-4 px-6 py-4`,
    "bg-gradient-to-r from-neon-600/30 to-electric-600/30",
    "border-b border-glow-neon backdrop-blur-sm",
    "shadow-inner",
    "sticky top-0 z-10",
  );

  const headerCellClasses = classNames(
    "text-sm font-semibold",
    "text-neon-300",
    "uppercase tracking-wider transition-all duration-300",
    "cursor-default",
  );

  const headerCellCenteredClasses = classNames(
    headerCellClasses,
    "text-center",
  );

  const headerCellRightClasses = classNames(headerCellClasses, "text-right");

  const getHeaderAlignment = (columnKey: string): string => {
    if (columnKey === "country") {
      return headerCellClasses;
    }
    if (columnKey === "iso_code") {
      return headerCellCenteredClasses;
    }
    if (columnKey === "year") {
      return headerCellCenteredClasses;
    }
    return headerCellRightClasses;
  };

  return (
    <div
      className={headerClasses}
      style={{
        gridTemplateColumns,
      }}
    >
      {allColumns.map((columnKey) => {
        let label = "";
        if (columnKey === "country") {
          label = "Country";
        } else if (columnKey === "iso_code") {
          label = "ISO Code";
        } else {
          label = getColumnLabel(columnKey);
        }

        return (
          <div className={getHeaderAlignment(columnKey)} key={columnKey}>
            {label}
          </div>
        );
      })}
    </div>
  );
};
