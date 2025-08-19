import type { JSX, ReactNode } from "react";

import Twemoji from "react-twemoji";

import { classNames } from "@/lib/class-names";

interface TwemojiWrapperProps {
  animated?: boolean;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  size?: "lg" | "md" | "sm" | "xl";
}

export function TwemojiWrapper({
  animated = false,
  children,
  className,
  interactive = false,
  size = "md",
}: TwemojiWrapperProps): JSX.Element {
  return (
    <Twemoji
      options={{
        className: classNames(
          "twemoji",
          size === "sm" && "w-4 h-4",
          size === "md" && "w-5 h-5",
          size === "lg" && "w-6 h-6",
          size === "xl" && "w-8 h-8",
          animated && "animate-bounce",
          interactive && "twemoji-interactive",
          className,
        ),
        ext: ".svg",
        folder: "svg",
      }}
    >
      <span>{children}</span>
    </Twemoji>
  );
}
