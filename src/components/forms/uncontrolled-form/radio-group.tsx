import type { FC } from "react";

import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  error?: string;
  label: string;
  name: string;
  options: Option[];
}

export const RadioGroup: FC<RadioGroupProps> = ({
  error,
  label,
  name,
  options,
}) => {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className={classNames("mt-1 flex gap-4")}>
        {options.map((opt) => (
          <label
            className={classNames(
              "flex cursor-pointer items-center gap-1 text-sm text-gray-500",
            )}
            key={opt.value}
          >
            <input
              className="cursor-pointer"
              name={name}
              type="radio"
              value={opt.value}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <p
        className={classNames(
          "text-error mt-1 h-2 text-sm",
          !error && "opacity-0",
        )}
      >
        {error}
      </p>
    </div>
  );
};
