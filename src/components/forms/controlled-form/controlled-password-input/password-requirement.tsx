import { classNames } from "@/lib/class-names";
import type { FC } from "react";

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

export const PasswordRequirement: FC<PasswordRequirementProps> = ({
  met,
  text,
}) => {
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
            : classNames("text-gray-400"),
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
