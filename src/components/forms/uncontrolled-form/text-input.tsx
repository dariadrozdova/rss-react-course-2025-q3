import type { FC, InputHTMLAttributes, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string;
  label: string | ReactNode;
}

export const TextInput: FC<TextInputProps> = ({
  error,
  id,
  label,
  ...props
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input {...props} />
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
