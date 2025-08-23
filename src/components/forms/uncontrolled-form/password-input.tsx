import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculatePasswordStrength,
  createPasswordStrengthHTML,
} from "@/utils/password-strength";
import { type FC, useCallback, useRef } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
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
  // Тип ref должен быть явно указан для 'HTMLInputElement'
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

      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}

      {showStrength && <div ref={strengthIndicatorRef}></div>}
    </div>
  );
};
