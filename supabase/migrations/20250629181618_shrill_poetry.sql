/*
  # Add favorites functionality

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `snippet_id` (uuid, foreign key to snippets)
      - `user_id` (uuid, for future user authentication)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `favorites` table
    - Add policy for public access (development mode)

  3. Indexes
    - Index on snippet_id for faster lookups
    - Composite index on user_id and snippet_id for unique constraints
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  user_id uuid DEFAULT gen_random_uuid(), -- Placeholder for future auth
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy for full access (for development - adjust for production)
CREATE POLICY "Enable all access for favorites development"
  ON favorites
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_snippet_id ON favorites(snippet_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_snippet ON favorites(user_id, snippet_id);

-- Ensure unique favorites per user per snippet
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique_user_snippet 
  ON favorites(user_id, snippet_id);