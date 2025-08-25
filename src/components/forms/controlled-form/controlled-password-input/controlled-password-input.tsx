import type { FC, InputHTMLAttributes } from "react";
import { useState } from "react";
import { type UseFormRegister, type UseFormWatch } from "react-hook-form";

import { PasswordStrengthIndicator } from "@/components/forms/controlled-form/controlled-password-input/password-strength-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";
import { type FormInput } from "@/utils/form-schema";

interface ControlledPasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  error?: string;
  id: keyof FormInput;
  isRequired?: boolean;
  label: string;
  register: ReturnType<UseFormRegister<FormInput>>;
  showStrength?: boolean;
  watch?: UseFormWatch<FormInput>;
}

export const ControlledPasswordInput: FC<ControlledPasswordInputProps> = ({
  error,
  id,
  isRequired = false,
  label,
  register,
  showStrength = false,
  watch,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const watchedValue = watch ? watch(id) : "";
  const passwordValue = typeof watchedValue === "string" ? watchedValue : "";

  return (
    <div className="mb-4">
      <Label htmlFor={id}>
        {label}
        {isRequired && <span className="text-error ml-1 font-bold">*</span>}
      </Label>

      <div className={classNames("relative")}>
        <Input
          {...register}
          {...props}
          type={showPassword ? "text" : "password"}
        />
        <div
          className={classNames("absolute top-1/2 right-2 -translate-y-1/2")}
        >
          <Button
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            size="sm"
            type="button"
            variant="ghost"
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {showStrength && <PasswordStrengthIndicator password={passwordValue} />}

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
