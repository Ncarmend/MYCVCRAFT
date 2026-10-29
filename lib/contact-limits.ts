/** Contact-form limits shared by the form (client) and /api/contact (server). */
export const CONTACT_LIMITS = { name: 100, email: 254, subject: 150, message: 5000 } as const;

/** Name of the honeypot input. Hidden from people; bots tend to fill every field. */
export const HONEYPOT_FIELD = "website";
