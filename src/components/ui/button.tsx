import { type ButtonHTMLAttributes, type FC } from "react";

import { classNames } from "@/lib/class-names";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "lg" | "md" | "sm";
  variant?: "danger" | "ghost" | "primary" | "secondary";
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  size = "md",
  variant = "primary",
  ...props
}) => {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2",
        "font-medium transition-all duration-200",
        "rounded-2xl shadow-md",
        "focus:ring-2 focus:ring-offset-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transform hover:scale-105 active:scale-95",
        "cursor-pointer",

        size === "sm" && "px-4 py-1.5 text-sm",
        size === "md" && "px-6 py-2 text-base",
        size === "lg" && "px-8 py-3 text-lg",

        variant === "primary" && [
          "bg-gradient-main text-white",
          "hover:opacity-90 hover:shadow-lg",
          "focus:ring-secondary/50",
          "disabled:hover:scale-100 disabled:hover:opacity-50",
        ],

        variant === "secondary" && [
          "border-secondary text-secondary border-2 bg-white",
          "focus:ring-secondary/50",
          "disabled:hover:text-secondary disabled:hover:bg-white",
        ],

        variant === "danger" && [
          "bg-red-500 text-white",
          "hover:bg-red-600 hover:shadow-lg",
          "focus:ring-red-500/50",
          "disabled:hover:bg-red-500",
        ],

        variant === "ghost" && [
          "text-text bg-transparent",
          "hover:bg-gray-100 hover:shadow-sm",
          "focus:ring-gray-500/50",
          "disabled:hover:bg-transparent",
        ],

        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
