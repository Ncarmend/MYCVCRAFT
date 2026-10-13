-- ════════════════════════════════════════════════════════════════════════════
-- CVixeo — security lockdown of the public schema (Supabase alert rls_disabled_in_public)
-- Date: 2026-10-13 · Reviewed migration · Idempotent · Changes no data
--
-- WHY THIS DESIGN
--   CVixeo never reads or writes these tables through the Supabase Data API
--   (PostgREST): there is no `supabase.from('<table>')` anywhere in the code.
--   All table access goes through Prisma, which connects as `postgres`
--   (table owner, BYPASSRLS = true). Every API route authenticates the user
--   with supabase.auth.getUser() and filters by the user's own id.
--
--   So the least-privilege model is: RLS ON with NO policies for anon /
--   authenticated (= deny all through the Data API), plus revoking their table
--   grants as a second layer. Prisma is unaffected because `postgres` bypasses RLS
--   and keeps its privileges. Ownership policies (auth.uid()) are deliberately NOT
--   added: they would re-open an access path the application doesn't use.
--
-- WHAT IT DOES NOT TOUCH
--   No table, column or row is altered or deleted. Auth (auth schema), Storage
--   (storage schema) and the service_role key keep working as before.
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

-- Fail fast instead of queueing behind long-running app queries.
SET LOCAL lock_timeout = '5s';

-- 1. Enable RLS on every application table (no policies = deny for anon/authenticated).
--    Not FORCEd: the owner role used by Prisma must keep bypassing RLS.
ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings  ENABLE ROW LEVEL SECURITY;

-- 2. Defense in depth: remove the Data API roles' privileges on these tables.
--    (Supabase grants ALL to anon/authenticated by default on new public tables.)
REVOKE ALL ON TABLE public.users, public.cvs, public.subscriptions,
                    public.job_matches, public.user_settings
  FROM anon, authenticated;

-- 3. Neutralise public.truncate_table(text): SECURITY DEFINER (runs as postgres),
--    callable by PUBLIC/anon/authenticated, unused by the application.
--    It is NOT dropped in case an external backup/restore tool relies on it;
--    service_role keeps EXECUTE. Drop it later if nothing uses it.
REVOKE EXECUTE ON FUNCTION public.truncate_table(text) FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.truncate_table(text) SET search_path = public, pg_temp;

-- 4. Future tables/functions/sequences created by `postgres` in public (e.g. via
--    `prisma db push`) will no longer be granted to anon/authenticated automatically.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

COMMIT;

-- ── Verification (read-only) ───────────────────────────────────────────────
-- SELECT relname, relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
--   WHERE n.nspname='public' AND relkind='r';                                  -- all true
-- SELECT table_name, grantee FROM information_schema.role_table_grants
--   WHERE table_schema='public' AND grantee IN ('anon','authenticated');       -- no rows
-- SELECT has_function_privilege('anon','public.truncate_table(text)','EXECUTE'); -- false
