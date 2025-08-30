import { type FC } from "react";

import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils/class-names";

export const SortControls: FC = () => {
  const { setSort, state } = useTableState();

  const buttonBaseClasses =
    "px-3 py-2 text-sm rounded-md transition-all duration-300 cursor-pointer";
  const activeClasses =
    "bg-neon-600/30 border-neon-500 text-neon-300 shadow-sm shadow-neon-500/20";
  const inactiveClasses =
    "bg-dark-700/50 border-slate-600 text-slate-300 hover:border-neon-500/50 hover:bg-dark-600/50 hover:text-slate-200";

  const getButtonClasses = (
    sortType: "name" | "population",
    direction: "asc" | "desc",
  ): string => {
    const isDefaultActive =
      !state.sortBy && sortType === "name" && direction === "asc";
    const isActive =
      isDefaultActive ||
      (state.sortBy === sortType && state.sortDirection === direction);

    return classNames(
      buttonBaseClasses,
      "border font-medium",
      isActive ? activeClasses : inactiveClasses,
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">Sort By:</label>
      <div className="flex flex-wrap gap-2">
        <button
          className={getButtonClasses("name", "asc")}
          onClick={() => {
            setSort("name", "asc");
          }}
        >
          Name A→Z
        </button>
        <button
          className={getButtonClasses("name", "desc")}
          onClick={() => {
            setSort("name", "desc");
          }}
        >
          Name Z→A
        </button>
        <button
          className={getButtonClasses("population", "desc")}
          onClick={() => {
            setSort("population", "desc");
          }}
        >
          Population ↓
        </button>
        <button
          className={getButtonClasses("population", "asc")}
          onClick={() => {
            setSort("population", "asc");
          }}
        >
          Population ↑
        </button>
      </div>
    </div>
  );
};
