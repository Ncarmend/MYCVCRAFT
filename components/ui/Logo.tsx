/**
 * Shared logo component — single source of truth for the Cvixeo brand mark.
 *
 * variant="light" (default): for white/light backgrounds.
 *   Uses mix-blend-mode:multiply so the logo's white background becomes
 *   transparent, showing only the coloured icon and wordmark.
 *
 * variant="dark": for dark/coloured backgrounds (footer, dark headers).
 *   Wraps the logo in a small opaque-white pill so the full-colour mark
 *   stays legible on any dark surface without a separate image file.
 */

interface LogoProps {
  variant?: "light" | "dark";
  /** Height of the logo image in px. Width scales automatically. */
  height?: number;
  className?: string;
}

export function Logo({ variant = "light", height = 32, className = "" }: LogoProps) {
  if (variant === "dark") {
    return (
      <span
        className={`inline-flex items-center rounded-lg bg-white px-2 py-0.5 ${className}`}
      >
        <img
          src="/logo.png"
          alt="Cvixeo"
          style={{ height: `${height}px`, width: "auto" }}
          className="object-contain"
        />
      </span>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="Cvixeo"
      style={{ height: `${height}px`, width: "auto", mixBlendMode: "multiply" }}
      className={`object-contain ${className}`}
    />
  );
}
