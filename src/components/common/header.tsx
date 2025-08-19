import type { JSX } from "react";

import { CatEmoji, TwemojiWrapper } from "@/components/twemoji";
import { classNames } from "@/lib/class-names";

export function Header(): JSX.Element {
  return (
    <header
      className={classNames(
        "bg-gradient-main",
        "p-6 text-white shadow-md",
        "relative overflow-hidden",
      )}
    >
      <div
        className={classNames(
          "absolute -top-4 -right-4 opacity-20",
          "animate-pulse",
        )}
      >
        <CatEmoji size="xl" variant="happy" />
      </div>

      <div
        className={classNames(
          "absolute top-1/2 -left-2 -translate-y-1/2",
          "opacity-10",
        )}
      >
        <CatEmoji animated size="xl" variant="paw" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <h1
          className={classNames("flex items-center gap-3 text-2xl font-bold")}
        >
          <CatEmoji animated variant="paw" />
          Purrfect Forms
        </h1>

        <div
          className={classNames(
            "hidden items-center gap-2 sm:flex",
            "text-sm opacity-80",
          )}
        >
          <span>Made with</span>
          <TwemojiWrapper animated size="sm">
            ❤️
          </TwemojiWrapper>
          <span>and</span>
          <CatEmoji animated size="sm" variant="face" />
        </div>
      </div>
    </header>
  );
}
