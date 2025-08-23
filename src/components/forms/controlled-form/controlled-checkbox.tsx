import type { FC } from "react";
import { type UseFormRegister } from "react-hook-form";

import { classNames } from "@/lib/class-names";
import { type FormInput } from "@/utils/form-schema";

interface ControlledCheckboxProps {
  error?: string;
  id: keyof FormInput;
  label: string;
  register: ReturnType<UseFormRegister<FormInput>>;
  isRequired?: boolean;
}

export const ControlledCheckbox: FC<ControlledCheckboxProps> = ({
  error,
  id,
  label,
  register,
  isRequired = false,
}) => {
  return (
    <div className="mb-4">
      <div className={classNames("flex items-center gap-2")}>
        <input
          className={classNames(
            "focus:border-purple-500 focus:ring-purple-500/50",
            "focus:ring-2 focus:outline-none",
            "cursor-pointer",
          )}
          id={id}
          type="checkbox"
          {...register}
        />
        <label
          className="cursor-pointer text-sm font-medium text-gray-500"
          htmlFor={id}
        >
          {label}
          {isRequired && <span className="text-error ml-1 font-bold">*</span>}
        </label>
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
