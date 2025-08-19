import type { JSX } from "react";

import { classNames } from "@/lib/class-names";

import { CatEmoji } from "./cat-emoji";

interface CatMessageProps {
  className?: string;
  message: string;
  onClose?: () => void;
  variant?: MessageVariant;
}

type MessageVariant = "error" | "info" | "success" | "warning";

const MESSAGE_CONFIGS: Record<
  MessageVariant,
  {
    bgColor: string;
    borderColor: string;
    cat: Parameters<typeof CatEmoji>[0]["variant"];
    color: string;
  }
> = {
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    cat: "sad",
    color: "text-red-700",
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    cat: "happy",
    color: "text-blue-700",
  },
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    cat: "love",
    color: "text-green-700",
  },
  warning: {
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    cat: "angry",
    color: "text-orange-700",
  },
};

export function CatMessage({
  className,
  message,
  onClose,
  variant = "info",
}: CatMessageProps): JSX.Element {
  const config = MESSAGE_CONFIGS[variant];

  return (
    <div
      className={classNames(
        "flex items-center gap-3 rounded-xl p-3",
        "shadow-sm transition-all duration-200",
        config.bgColor,
        config.borderColor,
        "border",
        className,
      )}
    >
      <CatEmoji animated={variant === "error"} size="md" variant={config.cat} />

      <span className={classNames("flex-1 text-sm font-medium", config.color)}>
        {message}
      </span>

      {onClose && (
        <button
          aria-label="Close message"
          className={classNames(
            "ml-auto rounded-full p-1",
            "transition-colors hover:bg-white/50",
            "text-gray-400 hover:text-gray-600",
          )}
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
}
