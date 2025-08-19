import type { FC, PropsWithChildren } from "react";

import { classNames } from "@/lib/class-names";

type CardProps = PropsWithChildren<{ className?: string }>;

export const Card: FC<CardProps> = ({ children, className }) => {
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
};
