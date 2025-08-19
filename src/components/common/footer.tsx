import type { JSX } from "react";

import { CatEmoji, TwemojiWrapper } from "@/components/twemoji";
import { classNames } from "@/lib/class-names";

export function Footer(): JSX.Element {
  return (
    <footer
      className={classNames(
        "p-4 text-center text-sm",
        "text-gray-500",
        "bg-white/50 backdrop-blur-sm",
        "border-t border-gray-100",
        "relative",
      )}
    >
      <div
        className={classNames(
          "absolute top-1/2 left-4 -translate-y-1/2",
          "opacity-30",
          "hidden sm:block",
        )}
      >
        <CatEmoji size="lg" variant="happy" />
      </div>

      <div
        className={classNames(
          "absolute top-1/2 right-4 -translate-y-1/2",
          "opacity-30",
          "hidden sm:block",
        )}
      >
        <CatEmoji size="lg" variant="love" />
      </div>

      <div className="relative z-10">
        <p className="mb-1">
          <a
            className={classNames(
              "hover:text-secondary",
              "underline transition-colors duration-200",
              "hover:no-underline",
              "inline-flex items-center gap-1",
            )}
            href="https://github.com/dariadrozdova"
            rel="noreferrer"
            target="_blank"
          >
            GitHub <TwemojiWrapper size="sm">🐙</TwemojiWrapper>
          </a>{" "}
          |{" "}
          <a
            className={classNames(
              "hover:text-secondary",
              "underline transition-colors duration-200",
              "hover:no-underline",
              "inline-flex items-center gap-1",
            )}
            href="https://rs.school/courses/reactjs"
            rel="noreferrer"
            target="_blank"
          >
            RS School <TwemojiWrapper size="sm">📚</TwemojiWrapper>
          </a>
        </p>

        <p
          className={classNames(
            "mt-1 text-xs opacity-60",
            "flex items-center justify-center gap-1",
          )}
        >
          <span>Powered by cats</span>
          <CatEmoji animated size="sm" variant="paw" />
        </p>
      </div>
    </footer>
  );
}
