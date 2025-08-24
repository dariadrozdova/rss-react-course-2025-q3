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
  if (!password) return null;

  const result = calculatePasswordStrength(password);

  const getStrengthColors = (strength: PasswordStrengthResult["strength"]) => {
    switch (strength) {
      case "weak":
        return {
          text: "text-error",
          bg: "bg-error",
          gradient: "from-error/20 to-error/5",
        };
      case "medium":
        return {
          text: "text-warning",
          bg: "bg-warning",
          gradient: "from-warning/20 to-warning/5",
        };
      case "strong":
        return {
          text: "text-success",
          bg: "bg-success",
          gradient: "from-success/20 to-success/5",
        };
    }
  };

  const colors = getStrengthColors(result.strength);

  return (
    <div className={classNames("mt-2", className)}>
      <div
        className={classNames(
          "mb-2 h-2 w-full rounded-full bg-gray-100",
          "overflow-hidden",
        )}
      >
        <div
          className={classNames(
            "h-2 rounded-full transition-all duration-500 ease-out",
            colors.bg,
            "shadow-sm",
          )}
          style={{ width: `${result.percentage}%` }}
        />
      </div>

      <div
        className={classNames(
          "rounded-lg p-3",
          "bg-gradient-to-r",
          colors.gradient,
          "border border-gray-100",
        )}
      >
        <div
          className={classNames(
            "mb-2 text-sm font-semibold capitalize",
            colors.text,
          )}
        >
          Password strength: {result.strength}
        </div>

        <div className={classNames("grid grid-cols-1 gap-1", "text-xs")}>
          <PasswordRequirement
            met={result.checks.hasMinLength}
            text="At least 8 characters"
          />
          <PasswordRequirement
            met={result.checks.hasUppercase}
            text="Uppercase letter (A-Z)"
          />
          <PasswordRequirement
            met={result.checks.hasLowercase}
            text="Lowercase letter (a-z)"
          />
          <PasswordRequirement
            met={result.checks.hasNumber}
            text="Number (0-9)"
          />
          <PasswordRequirement
            met={result.checks.hasSpecial}
            text="Special character (!@#$%...)"
          />
        </div>
      </div>
    </div>
  );
};

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

const PasswordRequirement: FC<PasswordRequirementProps> = ({ met, text }) => {
  return (
    <div
      className={classNames(
        "flex items-center gap-2",
        "transition-colors duration-300",
      )}
    >
      <span
        className={classNames(
          "h-4 w-4 flex-shrink-0 rounded-full",
          "flex items-center justify-center",
          "text-xs font-bold",
          met
            ? classNames("bg-success", "text-white")
            : classNames("bg-gray-200", "text-gray-400"),
        )}
      >
        {met ? "✓" : "○"}
      </span>
      <span
        className={classNames(
          met ? "text-success" : "text-gray-500",
          "transition-colors duration-300",
        )}
      >
        {text}
      </span>
    </div>
  );
};
