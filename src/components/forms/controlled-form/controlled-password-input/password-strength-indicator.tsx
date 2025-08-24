import { PasswordRequirement } from "@/components/forms/controlled-form/controlled-password-input/password-requirement";
import { classNames } from "@/lib/class-names";
import {
  calculatePasswordStrength,
  type PasswordStrengthResult,
} from "@/utils/password-strength";
import type { FC } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({
  password,
  className,
}) => {
  const result = password ? calculatePasswordStrength(password) : null;

  const getStrengthColors = (strength: PasswordStrengthResult["strength"]) => {
    switch (strength) {
      case "weak":
        return {
          text: "text-error",
          bg: "bg-error",
        };
      case "medium":
        return {
          text: "text-warning",
          bg: "bg-warning",
        };
      case "strong":
        return {
          text: "text-success",
          bg: "bg-success",
        };
    }
  };

  const colors = result ? getStrengthColors(result.strength) : null;

  return (
    <div className={classNames("mt-2", className)}>
      <div
        className={classNames(
          "mb-2 h-2 w-full rounded-full bg-gray-100",
          "overflow-hidden",
        )}
      >
        {password && (
          <div
            className={classNames(
              "h-2 rounded-full transition-all duration-500 ease-out",
              colors!.bg,
              "shadow-sm",
            )}
            style={{ width: `${result!.percentage}%` }}
          />
        )}
      </div>

      <div className="rounded-lg pr-3">
        <div
          className={classNames(
            "mb-2 text-sm font-semibold",
            colors?.text || "text-gray-500",
          )}
        >
          Password strength:{" "}
          <span className="inline-block w-20">{result?.strength || "—"}</span>
        </div>

        <div className={classNames("grid grid-cols-1 gap-1", "text-xs")}>
          <PasswordRequirement
            met={result?.checks.hasMinLength || false}
            text="At least 8 characters"
          />
          <PasswordRequirement
            met={result?.checks.hasUppercase || false}
            text="Uppercase letter (A-Z)"
          />
          <PasswordRequirement
            met={result?.checks.hasLowercase || false}
            text="Lowercase letter (a-z)"
          />
          <PasswordRequirement
            met={result?.checks.hasNumber || false}
            text="Number (0-9)"
          />
          <PasswordRequirement
            met={result?.checks.hasSpecial || false}
            text="Special character (!@#$%...)"
          />
        </div>
      </div>
    </div>
  );
};
