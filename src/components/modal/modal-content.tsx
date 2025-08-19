import { type FC } from "react";

import { CatEmoji } from "@/components/twemoji";
import { classNames } from "@/lib/class-names";

interface ModalContentProps {
  children: React.ReactNode;
  onClose: () => void;
  size?: "lg" | "md" | "sm" | "xl";
  title?: string;
}

const SIZE_CLASSES = {
  lg: "max-w-lg",
  md: "max-w-md",
  sm: "max-w-sm",
  xl: "max-w-xl",
};

export const ModalContent: FC<ModalContentProps> = ({
  children,
  onClose,
  size = "md",
  title,
}) => {
  return (
    <div
      className={classNames(
        "w-full",
        SIZE_CLASSES[size],
        "rounded-2xl bg-white shadow-2xl",
        "transform transition-all duration-200",
        "animate-in zoom-in-95 duration-200",
      )}
      onClick={(error) => {
        error.stopPropagation();
      }}
    >
      {title && (
        <header
          className={classNames(
            "flex items-center justify-between",
            "px-6 py-4",
            "border-b border-gray-100",
          )}
        >
          <h2
            className={classNames(
              "text-text text-lg font-semibold",
              "flex items-center gap-2",
            )}
          >
            <CatEmoji size="sm" variant="face" />
            {title}
          </h2>

          <button
            aria-label="Close modal"
            className={classNames(
              "rounded-full p-2",
              "transition-colors hover:bg-gray-100",
              "text-gray-400 hover:text-gray-600",
              "focus:ring-secondary/50 focus:ring-2 focus:outline-none",
            )}
            onClick={onClose}
          >
            <CatEmoji size="sm" variant="wink" />
          </button>
        </header>
      )}

      <main className={classNames("px-6", title ? "py-4" : "py-6")}>
        {children}
      </main>
    </div>
  );
};
