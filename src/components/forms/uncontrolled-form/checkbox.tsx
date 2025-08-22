import type { FC, InputHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string;
  label: string;
}

export const Checkbox: FC<CheckboxProps> = ({ error, id, label, ...props }) => {
  return (
    <div className="mb-4">
      <div className={classNames("flex items-center gap-2")}>
        <input
          className={classNames(
            "focus:border-purple-500 focus:ring-purple-500/50",
            "focus:ring-2 focus:outline-none",
            "cursor-pointer",
          )}
          id={id}
          type="checkbox"
          {...props}
        />
        <label
          className="cursor-pointer text-sm font-medium text-gray-500"
          htmlFor={id}
        >
          {label}
        </label>
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
