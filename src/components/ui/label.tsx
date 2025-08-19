import type { JSX, LabelHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps): JSX.Element {
  return (
    <label
      className={classNames(
        "mb-1 block",
        "text-text text-sm font-medium",
        "transition-colors duration-200",
        className,
      )}
      {...props}
    />
  );
}
