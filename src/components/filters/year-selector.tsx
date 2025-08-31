import { type FC, memo, useCallback, useMemo } from "react";

import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils";
import { LATEST_YEAR } from "@/utils/constants";

export const YearSelector: FC = memo(() => {
  const { setYear, state } = useTableState();

  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      const value = Number.parseInt(event.target.value, 10);
      setYear(value);
    },
    [setYear],
  );

  const selectValue = useMemo(() => {
    if (state.selectedYear === LATEST_YEAR && state.availableYears.length > 0) {
      return state.availableYears[0];
    }
    return state.selectedYear;
  }, [state.selectedYear, state.availableYears]);

  const selectClasses = classNames(
    "bg-dark-700/80 border border-neon-500/50 rounded-md",
    "text-slate-200 text-sm px-3 py-2 pr-10 min-w-[150px] w-full",
    "focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent",
    "hover:border-neon-400 hover:bg-neon-600/10 transition-all duration-300",
    "scrollbar-thin appearance-none cursor-pointer",
    "[&>option]:bg-dark-800 [&>option]:text-slate-200",
    "[&>option:checked]:bg-neon-600 [&>option:checked]:text-neon-100",
  );

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-sm font-medium text-slate-300"
        htmlFor="year-selector"
      >
        Select Year:
      </label>
      <div className="relative">
        <select
          className={selectClasses}
          id="year-selector"
          onChange={handleYearChange}
          value={selectValue ?? undefined}
        >
          {state.availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="text-neon-400 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

YearSelector.displayName = "YearSelector";
