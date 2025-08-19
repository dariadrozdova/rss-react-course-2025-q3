import type { JSX, PropsWithChildren } from "react";

import { classNames } from "@/lib/class-names";

type CardProps = PropsWithChildren<{ className?: string }>;

export function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div
      className={classNames(
        "rounded-2xl p-6",
        "bg-white",
        "border border-gray-100",
        "shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
