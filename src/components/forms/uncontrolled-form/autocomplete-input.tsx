import type { FC, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";

interface AutocompleteInputProps {
  error?: string;
  id: string;
  label: string | ReactNode;
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
    <div className="relative mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} list={`${id}-list`} name={name} />
      <datalist id={`${id}-list`}>
        {options.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <p
        className={classNames(
          "text-error mt-1 h-4 text-sm",
          !error && "opacity-0",
        )}
      >
        {error}
      </p>
    </div>
  );
};
