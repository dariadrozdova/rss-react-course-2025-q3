import { type FC } from "react";

import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils";
import { LATEST_YEAR } from "@/utils/constants";

export const YearSelector: FC = () => {
  const { setYear, state } = useTableState();

  const handleYearChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const value = event.target.value;
    setYear(value === "latest" ? LATEST_YEAR : Number.parseInt(value, 10));
  };

  const selectClasses = classNames(
    "bg-dark-700/80 border border-neon-500/50 rounded-md",
    "text-slate-200 text-sm px-3 py-2 min-w-[150px]",
    "focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent",
    "hover:border-neon-400 transition-all duration-300",
  );

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-sm font-medium text-slate-300"
        htmlFor="year-selector"
      >
        Select Year:
      </label>
      <select
        className={selectClasses}
        id="year-selector"
        onChange={handleYearChange}
        value={
          state.selectedYear === LATEST_YEAR ? "latest" : state.selectedYear
        }
      >
        <option value="latest">Latest Available</option>
        {state.availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
