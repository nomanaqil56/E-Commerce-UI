import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-text focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:translate-y-0 active:shadow-none",
          {
            "bg-primary-accent text-primary-text brutal-shadow border-2 border-primary-text": variant === "primary",
            "bg-surface-dark text-white brutal-shadow border-2 border-primary-text hover:bg-black": variant === "secondary",
            "bg-surface-secondary text-primary-text brutal-border hover:bg-primary-bg": variant === "outline",
            "bg-transparent hover:bg-black/5 text-primary-text": variant === "ghost",
            "bg-semantic-error text-white brutal-shadow border-2 border-primary-text": variant === "danger",
            "h-9 px-4 text-sm": size === "sm",
            "h-11 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
