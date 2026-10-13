-- ROLLBACK of 2026-10-13_rls_lockdown.sql — restores the previous (INSECURE) state.
-- Only use if the lockdown unexpectedly breaks something, and re-apply a fixed
-- version as soon as possible: this re-exposes all user data to the public anon key.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE public.users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions  DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings  DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.users, public.cvs, public.subscriptions,
                   public.job_matches, public.user_settings
  TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.truncate_table(text) TO PUBLIC, anon, authenticated;
ALTER FUNCTION public.truncate_table(text) RESET search_path;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES    TO anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;

COMMIT;
