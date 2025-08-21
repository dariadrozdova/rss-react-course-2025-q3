import type { FC } from "react";

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
    <div>
      <span className={classNames("block text-sm font-medium text-gray-500")}>
        {label}
      </span>
      <div className={classNames("mt-1 flex gap-4")}>
        {options.map((opt) => (
          <label key={opt.value}>
            <input name={name} type="radio" value={opt.value} /> {opt.label}
          </label>
        ))}
      </div>
      <p className={classNames("text-error h-5 text-sm")}>{error}</p>
    </div>
  );
};
