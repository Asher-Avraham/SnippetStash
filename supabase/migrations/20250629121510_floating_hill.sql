/*
  # Create snippets table

  1. New Tables
    - `snippets`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `language` (text, required)
      - `is_public` (boolean, default false)
      - `slug` (text, unique, required)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `snippets` table
    - Add policy for public read access to public snippets
    - Add policy for full access to all snippets (for development)
*/

CREATE TABLE IF NOT EXISTS snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  language text NOT NULL,
  is_public boolean DEFAULT false,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to public snippets
CREATE POLICY "Public snippets are viewable by everyone"
  ON snippets
  FOR SELECT
  USING (is_public = true);

-- Policy for full access (for development - adjust for production)
CREATE POLICY "Enable all access for development"
  ON snippets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_slug ON snippets(slug);
CREATE INDEX IF NOT EXISTS idx_snippets_public ON snippets(is_public) WHERE is_public = true;