import type { JSX, PropsWithChildren } from "react";

import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { classNames } from "@/lib/class-names";

export function Layout({ children }: PropsWithChildren): JSX.Element {
  return (
    <div
      className={classNames(
        "bg-background text-text",
        "flex min-h-screen flex-col",
        "relative",
      )}
    >
      <Header />

      <main
        className={classNames(
          "flex flex-1 flex-col items-center",
          "p-6",
          "from-background to-primary/10 bg-gradient-to-br via-white",
          "relative",
        )}
      >
        <div
          className={classNames(
            "fixed right-6 bottom-6 z-50",
            "cursor-pointer text-3xl",
            "transition-transform duration-300",
            "hover:scale-110 hover:rotate-12",
            "animate-bounce",
            "drop-shadow-lg",
          )}
        >
          😽
        </div>

        {children}
      </main>

      <Footer />
    </div>
  );
}
