import type { FC } from "react";

import { classNames } from "@/lib/class-names";

interface AutocompleteInputProps {
  error?: string;
  id: string;
  label: string;
  name: string;
  options: string[];
}

export const AutocompleteInput: FC<AutocompleteInputProps> = ({
  error,
  id,
  label,
  name,
  options,
}) => {
  return (
    <div>
      <label
        className={classNames("block text-sm font-medium text-gray-500")}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className={classNames(
          "border-secondary mt-1 block w-full rounded-md border p-2",
        )}
        id={id}
        list={`${id}-list`}
        name={name}
      />
      <datalist id={`${id}-list`}>
        {options.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <p className={classNames("text-error h-5 text-sm")}>{error}</p>
    </div>
  );
};
