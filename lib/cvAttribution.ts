/**
 * Free-plan CV attribution: a discreet "CV créé avec CVixeo.com" line at the
 * end of the CV. Shared by the React templates (live preview + in-app print)
 * and the /api/pdf HTML builder, so both render the exact same text and style.
 *
 * Whether it's shown is always decided on the server from the user's
 * subscription (isProUser) — never from a client-supplied value.
 *
 * Placement: it's the last element *in the normal flow* of the CV's main
 * content column, never positioned over the page. That guarantees it lands on
 * the last printed page and can't overlap CV content, whatever the paper size,
 * print margins, language or CV length. `break-inside: avoid` keeps the line
 * and its bottom padding together, so it never ends up under the owner-name
 * footer that print repeats at the bottom of every page.
 */

/** Exact wording — identical for every CV and interface language. */
export const CV_ATTRIBUTION_TEXT = "CV créé avec CVixeo.com";

/** Style properties (camelCase for React; converted to CSS for the HTML builder). */
export const CV_ATTRIBUTION_STYLE = {
  textAlign: "center",
  fontSize: "7.5pt",
  fontWeight: 400,
  fontStyle: "normal",
  textTransform: "none",
  letterSpacing: "0.03em",
  lineHeight: 1.4,
  color: "#9ca3af",
  paddingTop: "16px",
  paddingBottom: "28px",
  breakInside: "avoid",
  pageBreakInside: "avoid",
  // If it doesn't fit on the page, take the last CV block along to the next
  // page rather than leaving the line alone on an otherwise empty page.
  breakBefore: "avoid",
  pageBreakBefore: "avoid",
} as const;

/**
 * Horizontal shift that centres the line on the page when it sits in the main
 * column of a two-column layout: half the sidebar width, towards the sidebar.
 * Uses `transform`, so it never changes the layout itself.
 */
export function attributionOffset(sidebarWidthPx: number, sidebarSide: "left" | "right"): number {
  return sidebarSide === "left" ? -sidebarWidthPx / 2 : sidebarWidthPx / 2;
}

function toCss(style: Record<string, string | number>): string {
  return Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}:${v}`)
    .join(";");
}

/** HTML snippet for the /api/pdf builder. */
export function cvAttributionHtml(offsetXPx = 0): string {
  const style = offsetXPx ? { ...CV_ATTRIBUTION_STYLE, transform: `translateX(${offsetXPx}px)` } : CV_ATTRIBUTION_STYLE;
  return `<div class="cv-attribution" style="${toCss(style)}">${CV_ATTRIBUTION_TEXT}</div>`;
}
