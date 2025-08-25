import { type FC, type ReactNode, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUncontrolledPasswordStrength } from "@/hooks/use-uncontrolled-password-strength";
import { classNames } from "@/lib/class-names";

interface PasswordInputProps {
  className?: string;
  error?: string;
  id: string;
  label: ReactNode | string;
  name: string;
  showStrength?: boolean;
}

export const PasswordInput: FC<PasswordInputProps> = ({
  className = "",
  error,
  id,
  label,
  name,
  showStrength = false,
}) => {
  const strengthIndicatorReference = useUncontrolledPasswordStrength(id);
  const inputReference = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = (): void => {
    if (inputReference.current) {
      inputReference.current.type =
        inputReference.current.type === "password" ? "text" : "password";
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>

      <div className={classNames("relative")}>
        <Input id={id} name={name} ref={inputReference} type="password" />

        <div
          className={classNames(
            "absolute top-1/2 right-2 -translate-y-1/2",
            "flex items-center",
          )}
        >
          <Button
            onClick={togglePasswordVisibility}
            size="sm"
            type="button"
            variant="ghost"
          >
            Show
          </Button>
        </div>
      </div>

      {showStrength && (
        <div className="mt-2" ref={strengthIndicatorReference}>
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="password-progress-bar h-2 rounded-full bg-gray-200 shadow-sm transition-all duration-500 ease-out"
              style={{ width: "0%" }}
            />
          </div>

          <div className="rounded-lg pr-3">
            <div className="password-strength-text mb-2 text-sm font-semibold text-gray-500">
              Password strength: <span className="inline-block w-20">—</span>
            </div>

            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="password-requirement flex items-center gap-2 transition-colors duration-300">
                <span className="requirement-icon flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400">
                  ○
                </span>
                <span className="requirement-text text-gray-500 transition-colors duration-300">
                  At least 8 characters
                </span>
              </div>
              <div className="password-requirement flex items-center gap-2 transition-colors duration-300">
                <span className="requirement-icon flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400">
                  ○
                </span>
                <span className="requirement-text text-gray-500 transition-colors duration-300">
                  Uppercase letter (A-Z)
                </span>
              </div>
              <div className="password-requirement flex items-center gap-2 transition-colors duration-300">
                <span className="requirement-icon flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400">
                  ○
                </span>
                <span className="requirement-text text-gray-500 transition-colors duration-300">
                  Lowercase letter (a-z)
                </span>
              </div>
              <div className="password-requirement flex items-center gap-2 transition-colors duration-300">
                <span className="requirement-icon flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400">
                  ○
                </span>
                <span className="requirement-text text-gray-500 transition-colors duration-300">
                  Number (0-9)
                </span>
              </div>
              <div className="password-requirement flex items-center gap-2 transition-colors duration-300">
                <span className="requirement-icon flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400">
                  ○
                </span>
                <span className="requirement-text text-gray-500 transition-colors duration-300">
                  Special character (!@#$%...)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p
        className={classNames(
          "text-error mt-1 h-6 text-sm",
          !error && "opacity-0",
        )}
      >
        {error}
      </p>
    </div>
  );
};
