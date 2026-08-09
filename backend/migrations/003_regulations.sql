-- Statutory instruments (regulations), synced from statutoryinstruments-api.parliament.uk.
--
-- The SI API has no "deadline" field and no clean boolean for annulled/withdrawn — those
-- require parsing free-text timeline step names, which the sync does not attempt yet.
-- `status` and `house` are derived at sync time from whichever dates/laying fields are
-- present; see RegulationSyncService for the exact mapping.
CREATE TABLE IF NOT EXISTS regulations (
    id TEXT PRIMARY KEY,
    title TEXT,
    paper_prefix TEXT,
    paper_number INTEGER,
    paper_year TEXT,
    procedure_name TEXT,
    enabling_act_names TEXT[],
    laying_body_name TEXT,
    commons_laying_date TIMESTAMPTZ,
    lords_laying_date TIMESTAMPTZ,
    paper_made_date TIMESTAMPTZ,
    coming_into_force_date TIMESTAMPTZ,
    detail_url TEXT,
    workpackage_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS regulations_paper_made_date_idx ON regulations (paper_made_date DESC);
CREATE INDEX IF NOT EXISTS regulations_commons_laying_date_idx ON regulations (commons_laying_date DESC);
