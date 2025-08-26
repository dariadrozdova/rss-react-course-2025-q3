import type { FC } from "react";

import { TableRow } from "@/components/data-table/table-row";
import type { ProcessedCountryData, TableRowData } from "@/types/co2-data";
import { classNames } from "@/utils/class-names";

interface DataTableProps {
  countries: ProcessedCountryData[];
}

export const DataTable: FC<DataTableProps> = ({ countries }) => {
  const tableRows: TableRowData[] = [];

  for (const country of countries) {
    for (const yearData of country.data) {
      tableRows.push({
        co2: yearData.co2 ?? null,
        co2PerCapita: yearData.co2_per_capita ?? null,
        country: country.country,
        isoCode: country.isoCode,
        population: country.latestPopulation,
        year: yearData.year,
      });
    }
  }

  const containerClasses = classNames(
    "w-full h-full flex flex-col rounded-lg border shadow-2xl",
    "bg-dark-900/90 backdrop-blur-lg border-glow-neon",
    "shadow-neon-500/10 transition-all duration-300",
    "hover:shadow-neon-500/20 hover:border-neon-400",
  );

  const headerClasses = classNames(
    "grid grid-cols-6 gap-4 px-6 py-4",
    "bg-gradient-to-r from-neon-600/30 to-electric-600/30",
    "border-b border-glow-neon backdrop-blur-sm",
    "rounded-t-lg shadow-inner",
  );

  const headerCellClasses = classNames(
    "text-sm font-semibold text-slate-100",
    "uppercase tracking-wider transition-all duration-300",
    "hover:text-neon-300 hover:scale-105 cursor-default",
    "text-glow-neon",
  );

  const headerCellCenteredClasses = classNames(
    headerCellClasses,
    "text-center",
  );

  const headerCellRightClasses = classNames(headerCellClasses, "text-right");

  const bodyClasses = classNames(
    "flex-1 overflow-y-auto",
    "scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-neon-600",
    "hover:scrollbar-thumb-neon-500",
  );

  const emptyStateClasses = classNames(
    "flex items-center justify-center py-12",
    "text-slate-400 text-center",
  );

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <div className={headerCellClasses}>Country</div>
        <div className={headerCellRightClasses}>Population</div>
        <div className={headerCellCenteredClasses}>ISO Code</div>
        <div className={headerCellCenteredClasses}>Year</div>
        <div className={headerCellRightClasses}>CO₂ (t)</div>
        <div className={headerCellRightClasses}>CO₂ per Capita</div>
      </div>

      <div className={bodyClasses}>
        {tableRows.length > 0 ? (
          tableRows.map((row, index) => (
            <TableRow
              isEven={index % 2 === 0}
              key={`${row.country}-${row.year}`}
              rowData={row}
            />
          ))
        ) : (
          <div className={emptyStateClasses}>
            <div>
              <p className="mb-2 text-lg font-medium">No data available</p>
              <p className="text-sm">Unable to load CO₂ emissions data.</p>
            </div>
          </div>
        )}
      </div>

      {tableRows.length > 0 && (
        <div
          className={classNames(
            "border-glass-border border-t px-6 py-3",
            "bg-dark-800/50 rounded-b-lg",
            "text-center text-xs text-slate-400",
          )}
        >
          Showing {tableRows.length.toLocaleString()} data points from{" "}
          {countries.length} countries/regions
        </div>
      )}
    </div>
  );
};
