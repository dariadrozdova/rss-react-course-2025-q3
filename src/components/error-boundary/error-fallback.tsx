import type { FC } from "react";

import { classNames } from "@/utils";

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

const handleReload = (): void => {
  window.location.reload();
};

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error }) => {
  const containerClasses = classNames(
    "flex flex-col items-center justify-center min-h-md",
    "text-center space-y-4 p-8",
  );
  const iconClasses = classNames("text-5xl text-red-500 opacity-70");
  const titleClasses = classNames("text-2xl font-semibold text-slate-100");
  const messageClasses = classNames(
    "text-slate-400 max-w-md bg-slate-800 p-3 rounded-md font-mono text-sm",
  );
  const buttonClasses = classNames(
    "px-4 py-2 rounded-lg font-medium",
    "bg-blue-600 hover:bg-blue-500",
    "text-white transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900",
  );

  return (
    <div className={containerClasses} role="alert">
      <div className={iconClasses}>⚠️</div>
      <h2 className={titleClasses}>Oops! Something went wrong.</h2>
      <pre className={messageClasses}>
        <code>{error.message || "An unexpected error occurred."}</code>
      </pre>
      <button className={buttonClasses} onClick={handleReload}>
        Reload Application
      </button>
    </div>
  );
};
