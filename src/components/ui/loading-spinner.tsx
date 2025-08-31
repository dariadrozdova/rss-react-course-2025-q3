import type { FC } from "react";

import { classNames } from "@/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "lg" | "md" | "sm";
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  className,
  size = "md",
}) => {
  const sizeClasses = {
    lg: "h-12 w-12",
    md: "h-8 w-8",
    sm: "h-4 w-4",
  };

  const spinnerClasses = classNames(
    "animate-spin rounded-full border-2",
    "border-dark-600 border-t-neon-500 border-r-electric-500",
    sizeClasses[size],
    className,
  );

  return <div aria-label="Loading..." className={spinnerClasses} />;
};
