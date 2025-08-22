import { type FC, type InputHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={classNames(
        "w-full rounded-xl px-4 py-2",
        "text-gray-700",
        "border border-gray-300",
        "shadow-sm",
        "transition-all duration-200",
        "focus:border-purple-500 focus:ring-purple-500/50",
        "focus:ring-2 focus:outline-none",
        "hover:border-gray-400",
        "placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  );
};
