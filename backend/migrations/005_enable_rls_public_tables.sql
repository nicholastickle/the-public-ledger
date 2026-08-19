-- bills, bill_stages, bill_stage_sittings, parliamentary_divisions, and regulations
-- were created with RLS disabled, so the anon/authenticated Postgres roles used by
-- PostgREST (the Supabase auto-API) could read, edit, and delete every row directly,
-- bypassing the FastAPI backend entirely. That includes bills.originating_house and
-- parliamentary_divisions' aye/no counts — exactly the sponsor and division data the
-- impartiality product principle (see CLAUDE.md) says must never reach a citizen
-- before/during their shadow vote.
--
-- The FastAPI backend is the only intended reader/writer of these tables and always
-- connects with the service-role key, which bypasses RLS by design (see
-- 004_profiles_and_votes.sql for the same pattern on `votes`). No frontend code
-- queries these tables via the Supabase client. So enabling RLS with zero policies
-- makes them correctly return no rows and reject all writes for the anon/authenticated
-- roles, while leaving the backend's service-role access untouched.
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_stage_sittings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentary_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
