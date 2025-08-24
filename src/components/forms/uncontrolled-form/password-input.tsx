import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/class-names";
import {
  calculatePasswordStrength,
  createPasswordStrengthHTML,
} from "@/utils/password-strength";
import { type FC, type ReactNode, useCallback, useRef } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string | ReactNode;
  error?: string;
  showStrength?: boolean;
  className?: string;
}

export const PasswordInput: FC<PasswordInputProps> = ({
  id,
  name,
  label,
  error,
  showStrength = false,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const strengthIndicatorRef = useRef<HTMLDivElement>(null);

  const updatePasswordStrength = useCallback(() => {
    if (!showStrength) return;

    const password = inputRef.current?.value || "";
    const indicatorElement = strengthIndicatorRef.current;

    if (!indicatorElement) return;

    if (!password) {
      indicatorElement.innerHTML = "";
      return;
    }

    const result = calculatePasswordStrength(password);
    indicatorElement.innerHTML = createPasswordStrengthHTML(result);
  }, [showStrength]);

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>

      <Input
        ref={inputRef}
        type="password"
        name={name}
        id={id}
        onInput={updatePasswordStrength}
      />

      <p
        className={classNames(
          "text-error mt-1 h-4 text-sm",
          !error && "opacity-0",
        )}
      >
        {error}
      </p>

      {showStrength && <div ref={strengthIndicatorRef}></div>}
    </div>
  );
};
