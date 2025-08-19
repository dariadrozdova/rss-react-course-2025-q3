import type { JSX } from "react";

import { useState } from "react";

import { classNames } from "@/lib/class-names";

const CAT_MESSAGES = [
  "Meow! Fill out the form! 🐾",
  "Don't forget validation! 😸",
  "Kitties love good forms! 😻",
  "Check all the fields! 🐱",
  "Purrfect, everything is great! 😽",
];

export function CatHelper(): JSX.Element {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleClick = () => {
    setMessageIndex((previous) => (previous + 1) % CAT_MESSAGES.length);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        "fixed right-6 bottom-6 z-50",
        "max-w-xs rounded-2xl bg-white",
        "border border-gray-100 shadow-xl",
        "p-4 text-sm",
        "transform transition-all duration-300",
        "hover:scale-105",
      )}
    >
      <button
        className={classNames(
          "absolute -top-2 -right-2",
          "h-6 w-6 rounded-full",
          "bg-gray-200 hover:bg-gray-300",
          "flex items-center justify-center",
          "text-xs transition-colors",
        )}
        onClick={handleClose}
      >
        ✕
      </button>

      <div
        className={classNames(
          "cursor-pointer select-none",
          "flex items-start gap-3",
        )}
        onClick={handleClick}
      >
        <div className={classNames("animate-bounce text-2xl", "flex-shrink-0")}>
          😸
        </div>

        <div>
          <p className={classNames("text-text mb-2", "leading-relaxed")}>
            {CAT_MESSAGES[messageIndex]}
          </p>

          <p className={classNames("text-xs text-gray-400", "italic")}>
            Кликни на меня для новой подсказки!
          </p>
        </div>
      </div>
    </div>
  );
}
