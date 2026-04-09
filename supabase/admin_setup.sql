-- Admin setup migrations

-- 1. Add aktive flag to njoftimet (default true = visible)
ALTER TABLE njoftimet ADD COLUMN IF NOT EXISTS aktive BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Add gesperrt flag to profiles (default false = not banned)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gesperrt BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Add erledigt flag to meldungen (default false = open)
ALTER TABLE meldungen ADD COLUMN IF NOT EXISTS erledigt BOOLEAN NOT NULL DEFAULT FALSE;

-- 4. Index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_njoftimet_aktive ON njoftimet(aktive);
CREATE INDEX IF NOT EXISTS idx_njoftimet_user_id ON njoftimet(user_id);
CREATE INDEX IF NOT EXISTS idx_meldungen_erledigt ON meldungen(erledigt);
