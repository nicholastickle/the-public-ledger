CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY,
    short_title TEXT,
    long_title TEXT,
    originating_house TEXT,
    current_house TEXT,
    current_stage_id INTEGER,
    current_stage_name TEXT,
    is_act BOOLEAN NOT NULL DEFAULT FALSE,
    is_defeated BOOLEAN NOT NULL DEFAULT FALSE,
    bill_withdrawn TIMESTAMPTZ,
    introduced_session_id INTEGER,
    bill_type_id INTEGER,
    summary TEXT,
    parliament_last_update TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bill_stages (
    id INTEGER PRIMARY KEY,
    bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    stage_id INTEGER,
    stage_name TEXT,
    abbreviation TEXT,
    house TEXT,
    session_id INTEGER,
    sort_order INTEGER,
    last_update TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bill_stage_sittings (
    id SERIAL PRIMARY KEY,
    bill_stage_id INTEGER NOT NULL REFERENCES bill_stages(id) ON DELETE CASCADE,
    sitting_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (bill_stage_id, sitting_date)
);

-- division_id is the ID from the Parliament Votes API (not our own PK)
-- house + division_id together are unique since Commons and Lords share the same ID space
CREATE TABLE IF NOT EXISTS parliamentary_divisions (
    id SERIAL PRIMARY KEY,
    bill_stage_id INTEGER REFERENCES bill_stages(id) ON DELETE SET NULL,
    division_id INTEGER NOT NULL,
    house TEXT NOT NULL CHECK (house IN ('Commons', 'Lords')),
    division_date DATE NOT NULL,
    title TEXT,
    aye_count INTEGER,
    no_count INTEGER,
    content_count INTEGER,
    not_content_count INTEGER,
    did_pass BOOLEAN,
    division_number INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (house, division_id)
);

CREATE INDEX IF NOT EXISTS bills_is_act_idx ON bills (is_act);
CREATE INDEX IF NOT EXISTS bills_is_defeated_idx ON bills (is_defeated);
CREATE INDEX IF NOT EXISTS bills_parliament_last_update_idx ON bills (parliament_last_update DESC);
CREATE INDEX IF NOT EXISTS bill_stages_bill_id_idx ON bill_stages (bill_id);
CREATE INDEX IF NOT EXISTS parliamentary_divisions_bill_stage_id_idx ON parliamentary_divisions (bill_stage_id);
