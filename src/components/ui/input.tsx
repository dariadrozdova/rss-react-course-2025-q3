import type { InputHTMLAttributes, JSX } from "react";

import { classNames } from "@/lib/class-names";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps): JSX.Element {
  return (
    <input
      className={classNames(
        "w-full rounded-xl px-4 py-2",
        "text-text",
        "border border-gray-300",
        "shadow-sm",
        "transition-all duration-200",
        "focus:border-secondary focus:ring-secondary/50",
        "focus:ring-2 focus:outline-none",
        "hover:border-gray-400",
        "placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}
