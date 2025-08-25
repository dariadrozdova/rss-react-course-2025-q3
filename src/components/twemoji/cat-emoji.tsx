import { type FC } from "react";

import { TwemojiWrapper } from "@/components/twemoji/twemoji-wrapper";

interface CatEmojiProps {
  animated?: boolean;
  className?: string;
  interactive?: boolean;
  size?: "lg" | "md" | "sm" | "xl";
  variant?: CatVariant;
}

type CatVariant = "angry" | "face" | "happy" | "love" | "paw" | "sad" | "wink";

const CAT_EMOJIS: Record<CatVariant, string> = {
  angry: "😾",
  face: "🐱",
  happy: "😸",
  love: "😻",
  paw: "🐾",
  sad: "😿",
  wink: "😽",
};

export const CatEmoji: FC<CatEmojiProps> = ({
  animated = false,
  className,
  interactive = false,
  size = "md",
  variant = "happy",
}) => {
  return (
    <TwemojiWrapper
      animated={animated}
      className={className}
      emoji={CAT_EMOJIS[variant]}
      interactive={interactive}
      size={size}
    />
  );
};
