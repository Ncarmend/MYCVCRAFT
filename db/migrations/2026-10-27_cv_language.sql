-- CVixeo — per-CV document language (2026-10-27)
-- Additive and non-breaking: a NULLABLE column, no default, no data rewrite.
-- Existing CVs keep language = NULL and use the documented fallback
-- (lib/cv-language.ts) until the user saves them with an explicit language.
-- The running app is unaffected before deploy: the current Prisma client
-- doesn't select this column. Apply this BEFORE deploying the code that uses it.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS language text;

-- Only supported document languages (NULL allowed for legacy CVs).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cvs_language_check') THEN
    ALTER TABLE public.cvs ADD CONSTRAINT cvs_language_check CHECK (language IS NULL OR language IN ('en', 'fr', 'nl'));
  END IF;
END $$;

COMMIT;

-- Rollback (only if needed):  ALTER TABLE public.cvs DROP CONSTRAINT IF EXISTS cvs_language_check;
--                             ALTER TABLE public.cvs DROP COLUMN IF EXISTS language;
