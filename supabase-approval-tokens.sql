can I-- Add approval tokens table for email-based approvals
CREATE TABLE IF NOT EXISTS approval_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  week_id UUID NOT NULL REFERENCES weekly_menus(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'changes_requested')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE approval_tokens ENABLE ROW LEVEL SECURITY;

-- Public access policies for approval tokens
CREATE POLICY "Allow public to insert approval tokens"
  ON approval_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to read approval tokens"
  ON approval_tokens FOR SELECT
  USING (true);

CREATE POLICY "Allow public to update approval tokens"
  ON approval_tokens FOR UPDATE
  USING (true);

-- Index for faster token lookups
CREATE INDEX idx_approval_tokens_token ON approval_tokens(token);
CREATE INDEX idx_approval_tokens_week_id ON approval_tokens(week_id);
