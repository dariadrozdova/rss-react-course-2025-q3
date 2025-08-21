import type { FC, InputHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string;
  label: string;
}

export const FileInput: FC<FileInputProps> = ({
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
        type="file"
        {...props}
        className={classNames("mt-1 block w-full text-sm", props.className)}
      />
      <p className={classNames("text-error h-5 text-sm")}>{error}</p>
    </div>
  );
};
