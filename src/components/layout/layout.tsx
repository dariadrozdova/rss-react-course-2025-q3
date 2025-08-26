import type { FC, ReactNode } from "react";

import { classNames } from "@/utils/class-names";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const containerClasses = classNames(
    "min-h-screen h-screen w-full flex flex-col",
    "bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950",
    "bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,78,255,0.1),rgba(255,255,255,0))]",
  );

  const headerClasses = classNames(
    "sticky top-0 z-10 w-full",
    "bg-dark-800/90 backdrop-blur-lg border-b border-neon-500/30",
    "shadow-lg shadow-neon-500/10 glow-neon",
  );

  const titleClasses = classNames(
    "text-3xl font-bold text-transparent bg-clip-text",
    "bg-gradient-to-r from-neon-400 via-electric-400 to-cyber-400",
    "text-glow-neon",
    "mb-2 transition-all duration-300 hover:scale-105",
  );

  const mainClasses = classNames(
    "px-6 py-8",
    "flex-1 overflow-hidden",
    "bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950",
  );

  return (
    <div className={containerClasses}>
      <header className={headerClasses}>
        <div className={classNames("container mx-auto px-6 py-6")}>
          <h1 className={titleClasses}>CO₂ Emissions Data Viewer</h1>
          <p className={classNames("text-lg text-slate-400")}>
            Global carbon dioxide emissions data by country and year
          </p>
        </div>
      </header>

      <main className={mainClasses}>
        <div className="container mx-auto">{children}</div>
      </main>

      <footer
        className={classNames(
          "border-neon-500/30 bg-dark-800/90 border-t backdrop-blur-lg",
          "glow-neon py-6 text-center",
        )}
      >
        <div className="container mx-auto space-y-2 px-6">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="text-slate-300">Data source:</span>
            <a
              className={classNames(
                "text-azure-400 hover:text-azure-300",
                "transition-all duration-300 hover:scale-105",
                "hover:text-glow-neon decoration-azure-400/50 underline",
              )}
              href="https://ourworldindata.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Our World in Data
            </a>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <a
              className={classNames(
                "text-cyber-400 hover:text-cyber-300",
                "transition-all duration-300 hover:scale-110",
                "hover:glow-cyber flex items-center space-x-2",
              )}
              href="https://github.com/dariadrozdova"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>👩‍💻</span>
              <span>GitHub</span>
            </a>
            <a
              className={classNames(
                "text-electric-400 hover:text-electric-300",
                "transition-all duration-300 hover:scale-110",
                "hover:glow-electric flex items-center space-x-2",
              )}
              href="https://rs.school/courses/reactjs"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>🎓</span>
              <span>RS School React Course</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
