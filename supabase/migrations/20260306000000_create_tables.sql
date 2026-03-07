-- Tools table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  value NUMERIC(10,2) NOT NULL DEFAULT 0,
  photo_url TEXT,
  condition TEXT NOT NULL DEFAULT 'Good',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- People table
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'friend',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loans table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  borrowed_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expected_return_date TIMESTAMPTZ,
  actual_return_date TIMESTAMPTZ,
  condition_out TEXT NOT NULL DEFAULT 'Good',
  condition_in TEXT,
  location TEXT,
  notes TEXT,
  fee_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  fee_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (open policies for now, add auth later)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on tools" ON tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on people" ON people FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on loans" ON loans FOR ALL USING (true) WITH CHECK (true);
