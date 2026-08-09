CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- One row per Supabase Auth user. Created automatically by the trigger below.
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    display_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: select own row" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: update own row" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id) VALUES (NEW.id);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- The link between a user and what they voted for. Bills use an integer PK and
-- regulations use the Parliament API's string paper ID, so one polymorphic
-- column doesn't fit cleanly — exactly one of bill_id/regulation_id is set.
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    bill_id INTEGER REFERENCES bills (id),
    regulation_id TEXT REFERENCES regulations (id),
    choice TEXT NOT NULL CHECK (choice IN ('yes', 'no', 'abstain')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK ((bill_id IS NOT NULL)::int + (regulation_id IS NOT NULL)::int = 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS votes_user_bill_unique
    ON votes (user_id, bill_id) WHERE bill_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS votes_user_regulation_unique
    ON votes (user_id, regulation_id) WHERE regulation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS votes_bill_id_idx ON votes (bill_id) WHERE bill_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS votes_regulation_id_idx ON votes (regulation_id) WHERE regulation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS votes_created_at_idx ON votes (created_at DESC);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Votes are append-only: insert-your-own and select-your-own only. No UPDATE or
-- DELETE policy exists at all, so a cast vote can never be altered or removed
-- through the API or the anon/authenticated Postgres roles — only a service-role
-- (backend) connection could, and the backend never does. This is what makes the
-- "votes committed to an append-only log" product principle true at the DB layer,
-- not just by convention.
CREATE POLICY "votes: insert own" ON votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes: select own" ON votes
    FOR SELECT USING (auth.uid() = user_id);

-- Aggregate tallies. Deliberately a plain view, not a materialized/trigger-maintained
-- counter table — simplest thing that works at current vote volume. The FastAPI
-- backend reads these (and the anonymized recent-votes feed) via the service-role
-- key, which bypasses RLS by design — the anon key never queries `votes` directly,
-- so no client ever sees a row with anyone else's user_id attached.
CREATE OR REPLACE VIEW bill_vote_tallies AS
SELECT
    bill_id,
    count(*) FILTER (WHERE choice = 'yes') AS yes_count,
    count(*) FILTER (WHERE choice = 'no') AS no_count,
    count(*) FILTER (WHERE choice = 'abstain') AS abstain_count
FROM votes
WHERE bill_id IS NOT NULL
GROUP BY bill_id;

CREATE OR REPLACE VIEW regulation_vote_tallies AS
SELECT
    regulation_id,
    count(*) FILTER (WHERE choice = 'yes') AS yes_count,
    count(*) FILTER (WHERE choice = 'no') AS no_count,
    count(*) FILTER (WHERE choice = 'abstain') AS abstain_count
FROM votes
WHERE regulation_id IS NOT NULL
GROUP BY regulation_id;
