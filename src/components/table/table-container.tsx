import { type FC, type ReactNode } from "react";

import { classNames } from "@/utils/class-names";

interface TableContainerProps {
  children: ReactNode;
}

export const TableContainer: FC<TableContainerProps> = ({ children }) => {
  const containerClasses = classNames(
    "w-full flex flex-col rounded-lg border shadow-2xl",
    "bg-dark-900/90 backdrop-blur-lg border-glow-neon",
    "shadow-neon-500/10 transition-all duration-300",
    "hover:shadow-neon-500/20 hover:border-neon-400",
    "overflow-hidden",
    "max-h-[70vh] h-[70vh]",
  );

  const scrollableContainerClasses = classNames(
    "flex-1 overflow-auto",
    "scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-neon-600",
    "hover:scrollbar-thumb-neon-500",
  );

  return (
    <div className={containerClasses}>
      <div className={scrollableContainerClasses}>{children}</div>
    </div>
  );
};
