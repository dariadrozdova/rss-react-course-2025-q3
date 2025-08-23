import type { FC } from "react";
import { type UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";
import { type FormInput } from "@/utils/form-schema";

interface ControlledRadioGroupProps {
  error?: string;
  label: string;
  options: Option[];
  register: ReturnType<UseFormRegister<FormInput>>;
  isRequired?: boolean;
}

interface Option {
  label: string;
  value: string;
}

export const ControlledRadioGroup: FC<ControlledRadioGroupProps> = ({
  error,
  label,
  options,
  register,
  isRequired = false,
}) => {
  return (
    <div className="mb-4">
      <Label>
        {label}
        {isRequired && <span className="text-error ml-1 font-bold">*</span>}
      </Label>
      <div className={classNames("mt-1 flex gap-4")}>
        {options.map((opt) => (
          <label
            className={classNames(
              "flex cursor-pointer items-center gap-1 text-sm text-gray-500",
            )}
            key={opt.value}
          >
            <input
              className={classNames(
                "focus:border-purple-500 focus:ring-purple-500/50",
                "focus:ring-2 focus:outline-none",
                "cursor-pointer",
              )}
              type="radio"
              value={opt.value}
              {...register}
            />
            {opt.label}
          </label>
        ))}
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
