/**
 * Reusable Button component with variants
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const variantStyles = {
  primary:
    "bg-slate-600 text-white hover:bg-green-600 active:bg-green-700 focus-visible:ring-slate-500 shadow-sm",
  secondary:
    "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400 shadow-sm",
  ghost:
    "text-gray-600 hover:bg-gray-100 active:bg-gray-200 hover:text-gray-900 focus-visible:ring-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-sm",
  outline:
    "border-2 border-slate-600 text-slate-600 hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white focus-visible:ring-slate-500",
};

const sizeStyles = {
  sm: "h-7 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-9 px-5 text-sm rounded-lg",
  icon: "h-9 w-9 rounded-lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
