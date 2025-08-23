import type { FC, InputHTMLAttributes } from "react";
import { type UseFormRegister, type UseFormWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";
import {
  MEDIUM_PASSWORD_SCORE_THRESHOLD,
  MIN_PASSWORD_LENGTH,
  WEAK_PASSWORD_SCORE_THRESHOLD,
} from "@/lib/constants";
import { type FormSchema } from "@/utils/form-schema";

interface ControlledTextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  error?: string;
  id: keyof FormSchema;
  label: string;
  register: ReturnType<UseFormRegister<FormSchema>>;
  watch?: UseFormWatch<FormSchema>;
}

const getPasswordStrength = (password: string): string => {
  const checks = {
    hasLowercase: /[a-z]/.test(password),
    hasMinLength: password.length >= MIN_PASSWORD_LENGTH,
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score <= WEAK_PASSWORD_SCORE_THRESHOLD) {
    return "Weak";
  }
  if (score <= MEDIUM_PASSWORD_SCORE_THRESHOLD) {
    return "Medium";
  }
  return "Strong";
};

export const ControlledTextInput: FC<ControlledTextInputProps> = ({
  error,
  id,
  label,
  register,
  type,
  watch,
  ...props
}) => {
  const isPasswordField = type === "password" && id === "password";
  const passwordValue = watch ? watch("password") : "";
  const showPasswordStrength = isPasswordField && passwordValue;

  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input {...register} {...props} type={type} />
      {showPasswordStrength && (
        <p className="mt-1 text-sm text-gray-500">
          Strength: {getPasswordStrength(passwordValue)}
        </p>
      )}
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
