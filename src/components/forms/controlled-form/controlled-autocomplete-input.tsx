import type { FC } from "react";
import { type UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";
import { type FormSchema } from "@/utils/form-schema";

interface ControlledAutocompleteInputProps {
  error?: string;
  id: keyof FormSchema;
  label: string;
  options: string[];
  register: ReturnType<UseFormRegister<FormSchema>>;
}

export const ControlledAutocompleteInput: FC<
  ControlledAutocompleteInputProps
> = ({ error, id, label, options, register }) => {
  return (
    <div className="relative mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input {...register} list={`${id}-list`} />
      <datalist id={`${id}-list`}>
        {options.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
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
