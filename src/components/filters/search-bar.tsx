import { type FC } from "react";

import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils/class-names";

export const SearchBar: FC = () => {
  const { setSearch, state } = useTableState();

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    // без debounce, неоптимизированная версия
    setSearch(event.target.value);
  };

  const inputClasses = classNames(
    "bg-dark-700/80 border border-neon-500/50 rounded-md",
    "text-slate-200 text-sm px-3 py-2 w-full",
    "focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent",
    "hover:border-neon-400 transition-all duration-300",
    "placeholder:text-slate-400",
  );

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-sm font-medium text-slate-300"
        htmlFor="search-input"
      >
        Search Countries:
      </label>
      <input
        className={inputClasses}
        id="search-input"
        onChange={handleSearchChange}
        placeholder="Type country name..."
        type="text"
        value={state.searchTerm}
      />
    </div>
  );
};
