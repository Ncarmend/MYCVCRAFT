/**
 * Resolves the name shown in the CV's printed/PDF footer.
 *
 * Priority: the CV's own name field, then the authenticated user's profile
 * name. Never falls back to an email, user ID, CV ID, or any other
 * technical value — an empty result means "render no footer" rather than
 * showing something that isn't a person's name.
 */
export function resolveCvFooterName(cvName: unknown, profileName?: unknown): string {
  if (typeof cvName === "string" && cvName.trim()) return cvName.trim();
  if (typeof profileName === "string" && profileName.trim()) return profileName.trim();
  return "";
}
