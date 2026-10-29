-- CVixeo — contact-form rate limiting (2026-10-28)
-- Additive: one new table, nothing existing is changed or deleted.
-- Holds only a hash of the visitor IP + a timestamp; rows are purged after 24 h
-- by app/api/contact. Accessed only through Prisma (postgres role), so RLS is
-- enabled with no policies, like every other table (deny-all via the Data API).
-- The app keeps working if this runs after the deploy (the limiter fails open),
-- but rate limiting is only active once the table exists.

BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  "id"        text PRIMARY KEY,
  "key"       text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "contact_rate_limits_key_createdAt_idx" ON public.contact_rate_limits ("key", "createdAt");
CREATE INDEX IF NOT EXISTS "contact_rate_limits_createdAt_idx" ON public.contact_rate_limits ("createdAt");

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.contact_rate_limits FROM anon, authenticated;

COMMIT;

-- Rollback (only if needed):  DROP TABLE IF EXISTS public.contact_rate_limits;
