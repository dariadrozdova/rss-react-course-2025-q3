import { type FC } from "react";

import { FilterBar } from "@/components/filters";
import { TableView } from "@/components/table/table-view";
import { useTableData } from "@/hooks/use-table-data";
import type { ProcessedCountryData } from "@/types/co2-data";

interface DataTableProps {
  countries: ProcessedCountryData[];
}

export const DataTable: FC<DataTableProps> = ({ countries }) => {
  const { hasSearchResults, searchTerm, selectedYear, tableRows, totalRows } =
    useTableData(countries);

  return (
    <div className="space-y-4">
      <FilterBar />
      <TableView
        hasSearchResults={hasSearchResults}
        searchTerm={searchTerm}
        selectedYear={selectedYear}
        tableRows={tableRows}
        totalRows={totalRows}
      />
    </div>
  );
};
