import type { FC, InputHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string;
  label: string;
}

export const Checkbox: FC<CheckboxProps> = ({ error, id, label, ...props }) => {
  return (
    <div>
      <div className={classNames("flex items-center gap-2")}>
        <input id={id} type="checkbox" {...props} />
        <label htmlFor={id}>{label}</label>
      </div>
      <p className={classNames("text-error h-5 text-sm")}>{error}</p>
    </div>
  );
};
