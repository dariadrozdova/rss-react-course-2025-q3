import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUncontrolledPasswordStrength } from "@/hooks/use-uncontrolled-password-strength";
import { classNames } from "@/lib/class-names";
import { type FC, type ReactNode } from "react";

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
  const strengthIndicatorRef = useUncontrolledPasswordStrength(id);

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>

      <Input type="password" name={name} id={id} />

      <p
        className={classNames(
          "text-error mt-1 h-4 text-sm",
          !error && "opacity-0",
        )}
      >
        {error}
      </p>

      {showStrength && (
        <div ref={strengthIndicatorRef} className="mt-2">
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="password-progress-bar h-2 rounded-full bg-gray-200 shadow-sm transition-all duration-500 ease-out"
              style={{ width: "0%" }}
            ></div>
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
    </div>
  );
};
