import React from "react";
import { cn } from "../../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary-text text-primary-bg": variant === "default",
          "border-transparent bg-semantic-success text-white": variant === "success",
          "border-transparent bg-semantic-warning text-black": variant === "warning",
          "border-transparent bg-semantic-error text-white": variant === "error",
          "border-border text-primary-text": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
