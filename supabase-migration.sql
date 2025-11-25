-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on page for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read comments
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert comments
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

