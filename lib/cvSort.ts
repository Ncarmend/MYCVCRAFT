/**
 * Chronological sorting for CV sections (experience, education, certifications).
 *
 * Dates are free-text fields the user types by hand (see CVForm.tsx) — not a
 * date picker — so they arrive as strings like "Jan 2022", "janvier 2022",
 * "mrt 2019", a bare year "2018", or a localized "current" word ("Present",
 * "Présent", "Heden", ...). This module turns those strings into a
 * comparable value and sorts on it. It never touches the stored order —
 * callers apply it only where a CV is being displayed (React templates, the
 * PDF/HTML generator), so the editor and the database keep whatever order
 * the user typed things in.
 */

const MONTHS: Record<string, number> = {
  // English
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
  // French
  janv: 0, janvier: 0,
  fevr: 1, fevrier: 1,
  mars: 2,
  avr: 3, avril: 3,
  mai: 4,
  juin: 5,
  juil: 6, juillet: 6,
  aout: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  // Dutch
  januari: 0,
  februari: 1,
  mrt: 2, maart: 2,
  mei: 4,
  juni: 5,
  juli: 6,
  augustus: 7,
  okt: 9, oktober: 9,
  // "november" and "december" are spelled identically in Dutch and English —
  // already covered by the English entries above.
};

const PRESENT_TOKENS = new Set([
  // English
  "present", "current", "currently", "now", "ongoing", "today",
  // French
  "aujourdhui", "actuellement", "present",
  // Dutch
  "heden", "huidig", "actueel", "nu",
]);

/** Lowercase, strip accents, drop anything that isn't a letter/digit. */
function normalizeToken(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function isPresentToken(raw: string): boolean {
  return PRESENT_TOKENS.has(normalizeToken(raw));
}

/**
 * Parses a free-text CV date into a value comparable across entries:
 * - a "current/present" word (any of en/fr/nl) → `Infinity` (outranks every real date)
 * - "Month Year" or "YYYY-MM" → `year * 12 + monthIndex`
 * - a bare year → January of that year
 * - anything empty, unrecognized, or not a string → `null`
 *
 * `null` is a safe, explicit "unknown" — callers never throw on it, they just
 * rank it last, so one bad date never breaks the sorting of the rest.
 */
export function parseCvDate(raw: unknown): number | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value) return null;
  if (isPresentToken(value)) return Infinity;

  const monthYear = value.match(/^([A-Za-zÀ-ÿ]+)\.?\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTHS[normalizeToken(monthYear[1])];
    const year = parseInt(monthYear[2], 10);
    if (month !== undefined && !Number.isNaN(year)) return year * 12 + month;
  }

  const isoMonth = value.match(/^(\d{4})-(\d{2})$/);
  if (isoMonth) {
    const year = parseInt(isoMonth[1], 10);
    const month = parseInt(isoMonth[2], 10) - 1;
    if (!Number.isNaN(year) && month >= 0 && month <= 11) return year * 12 + month;
  }

  const yearOnly = value.match(/^(\d{4})$/);
  if (yearOnly) return parseInt(yearOnly[1], 10) * 12;

  return null;
}

/** Descending compare that stays correct when either side is ±Infinity (plain subtraction gives NaN there). */
function compareDesc(a: number, b: number): number {
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

export interface DateRangeLike {
  startDate?: unknown;
  endDate?: unknown;
}

export interface SingleDateLike {
  date?: unknown;
}

/**
 * Sorts entries that have a start/end range (experience, education) most-recent-first.
 *
 * Primary key is the *end* date — an ongoing entry ("Present") outranks a
 * finished one even if the finished one started later, matching how CVs are
 * conventionally read (the role you're still in comes first). Start date is
 * the tiebreaker (e.g. two entries both ending "Present"). Entries with no
 * usable date sort last, in their original relative order.
 */
export function sortByDateRangeDesc<T extends DateRangeLike>(items: T[]): T[] {
  return items
    .map((item, index) => {
      const end = parseCvDate(item.endDate) ?? parseCvDate(item.startDate) ?? -Infinity;
      const start = parseCvDate(item.startDate) ?? -Infinity;
      return { item, index, end, start };
    })
    .sort((a, b) => {
      const endCmp = compareDesc(a.end, b.end);
      if (endCmp !== 0) return endCmp;
      const startCmp = compareDesc(a.start, b.start);
      if (startCmp !== 0) return startCmp;
      return a.index - b.index;
    })
    .map((wrapped) => wrapped.item);
}

/** Sorts entries with a single date field (certifications) most-recent-first. */
export function sortByDateDesc<T extends SingleDateLike>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index, key: parseCvDate(item.date) ?? -Infinity }))
    .sort((a, b) => {
      const cmp = compareDesc(a.key, b.key);
      if (cmp !== 0) return cmp;
      return a.index - b.index;
    })
    .map((wrapped) => wrapped.item);
}

/**
 * Returns a shallow copy of a CV-shaped object with `experience`, `education`
 * and `certifications` replaced by their chronologically-sorted versions.
 * Any other field (skills, languages, personal info, etc.) passes through
 * untouched — those sections aren't chronological and are never reordered.
 *
 * This is the single place every renderer (React templates via
 * `TemplateRenderer`, the PDF/HTML generator via `buildCVHTML`) applies
 * sorting, so no individual template needs its own sorting logic.
 */
export function sortCvSections<T extends Record<string, unknown>>(cv: T): T {
  const next: Record<string, unknown> = { ...cv };
  if (Array.isArray(cv.experience)) next.experience = sortByDateRangeDesc(cv.experience as DateRangeLike[]);
  if (Array.isArray(cv.education)) next.education = sortByDateRangeDesc(cv.education as DateRangeLike[]);
  if (Array.isArray(cv.certifications)) next.certifications = sortByDateDesc(cv.certifications as SingleDateLike[]);
  return next as T;
}
