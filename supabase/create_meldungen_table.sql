-- Create meldungen (reports) table
CREATE TABLE IF NOT EXISTS meldungen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anzeige_id UUID REFERENCES njoftimet(id) ON DELETE CASCADE,
  gemeldeter_nutzer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verstoss_kategoria TEXT NOT NULL,
  freitext TEXT,
  krijuar_me TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE meldungen ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert reports"
  ON meldungen FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Admins (service role) can read all
CREATE POLICY "Service role can read all reports"
  ON meldungen FOR SELECT
  TO service_role
  USING (true);
