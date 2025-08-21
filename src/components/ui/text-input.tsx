import type { FC, InputHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string;
  label: string;
}

export const TextInput: FC<TextInputProps> = ({
  error,
  id,
  label,
  ...props
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
        id={id}
        {...props}
        className={classNames(
          "border-secondary mt-1 block w-full rounded-md border p-2",
          props.className,
        )}
      />
      <p className={classNames("text-error h-5 text-sm")}>{error}</p>
    </div>
  );
};
