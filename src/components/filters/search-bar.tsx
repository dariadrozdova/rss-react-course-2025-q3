import { type FC, memo, useCallback, useRef } from "react";

import { useTableState } from "@/contexts/table-context";
import { classNames } from "@/utils/class-names";
import { SEARCH_DEBOUNCE_DELAY } from "@/utils/constants";

const useDebounce = (
  callback: (value: string) => void,
  delay: number,
): ((value: string) => void) => {
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (value: string) => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }

      timeoutReference.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay],
  );
};

export const SearchBar: FC = memo(() => {
  const { setSearch, state } = useTableState();

  const debouncedSearch = useDebounce(setSearch, SEARCH_DEBOUNCE_DELAY);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      debouncedSearch(event.target.value);
    },
    [debouncedSearch],
  );

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
        defaultValue={state.searchTerm}
        id="search-input"
        onChange={handleSearchChange}
        placeholder="Type country name..."
        type="text"
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";
