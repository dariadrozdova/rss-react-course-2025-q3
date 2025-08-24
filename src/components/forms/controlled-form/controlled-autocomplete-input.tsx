import type { FC } from "react";
import { type UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";
import { type FormInput } from "@/utils/form-schema";

interface ControlledAutocompleteInputProps {
  error?: string;
  id: keyof FormInput;
  isRequired?: boolean;
  label: string;
  options: string[];
  register: ReturnType<UseFormRegister<FormInput>>;
}

export const ControlledAutocompleteInput: FC<
  ControlledAutocompleteInputProps
> = ({ error, id, isRequired = false, label, options, register }) => {
  return (
    <div className="relative mb-4">
      <Label htmlFor={id}>
        {label}
        {isRequired && <span className="text-error ml-1 font-bold">*</span>}
      </Label>
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
