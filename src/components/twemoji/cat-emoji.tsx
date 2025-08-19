import type { JSX } from "react";

import { TwemojiWrapper } from "./twemoji-wrapper";

interface CatEmojiProps {
  animated?: boolean;
  className?: string;
  interactive?: boolean;
  size?: "lg" | "md" | "sm" | "xl";
  variant?: CatVariant;
}

type CatVariant = "angry" | "face" | "happy" | "love" | "paw" | "sad" | "wink";

const CAT_EMOJIS: Record<CatVariant, string> = {
  happy: "😸",
  love: "😻",
  wink: "😽",
  sad: "😿",
  angry: "😾",
  paw: "🐾",
  face: "🐱",
};

export function CatEmoji({
  animated = false,
  className,
  interactive = false,
  size = "md",
  variant = "happy",
}: CatEmojiProps): JSX.Element {
  return (
    <TwemojiWrapper
      animated={animated}
      className={className}
      interactive={interactive}
      size={size}
    >
      {CAT_EMOJIS[variant]}
    </TwemojiWrapper>
  );
}
