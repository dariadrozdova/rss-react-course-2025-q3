import { type FC, memo, useCallback, useMemo } from "react";

import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils/class-names";

export const SortControls: FC = memo(() => {
  const { setSort, state } = useTableState();

  const handleNameAsc = useCallback(() => {
    setSort("name", "asc");
  }, [setSort]);

  const handleNameDesc = useCallback(() => {
    setSort("name", "desc");
  }, [setSort]);

  const handlePopulationDesc = useCallback(() => {
    setSort("population", "desc");
  }, [setSort]);

  const handlePopulationAsc = useCallback(() => {
    setSort("population", "asc");
  }, [setSort]);

  const buttonStyles = useMemo(() => {
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

    return {
      nameAsc: getButtonClasses("name", "asc"),
      nameDesc: getButtonClasses("name", "desc"),
      populationAsc: getButtonClasses("population", "asc"),
      populationDesc: getButtonClasses("population", "desc"),
    };
  }, [state.sortBy, state.sortDirection]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">Sort By:</label>
      <div className="flex flex-wrap gap-2">
        <button className={buttonStyles.nameAsc} onClick={handleNameAsc}>
          Name A→Z
        </button>
        <button className={buttonStyles.nameDesc} onClick={handleNameDesc}>
          Name Z→A
        </button>
        <button
          className={buttonStyles.populationDesc}
          onClick={handlePopulationDesc}
        >
          Population ↓
        </button>
        <button
          className={buttonStyles.populationAsc}
          onClick={handlePopulationAsc}
        >
          Population ↑
        </button>
      </div>
    </div>
  );
});

SortControls.displayName = "SortControls";
