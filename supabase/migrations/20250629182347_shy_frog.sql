/*
  # Add Tags System to Snippets

  1. New Tables
    - `tags` - Store unique tag names
    - `snippet_tags` - Many-to-many relationship between snippets and tags
  
  2. Changes to Existing Tables
    - No changes to existing snippets table structure
  
  3. Security
    - Enable RLS on both new tables
    - Add policies for public access to tags
    - Add policies for managing snippet-tag relationships
  
  4. Performance
    - Add indexes for efficient tag queries
    - Add unique constraints to prevent duplicates
*/

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#6366f1', -- Default indigo color
  created_at timestamptz DEFAULT now()
);

-- Create snippet_tags junction table
CREATE TABLE IF NOT EXISTS snippet_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_tags ENABLE ROW LEVEL SECURITY;

-- Policies for tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags
  FOR SELECT
  USING (true);

CREATE POLICY "Enable all access for tags development"
  ON tags
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policies for snippet_tags
CREATE POLICY "Snippet tags are viewable by everyone"
  ON snippet_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Enable all access for snippet tags development"
  ON snippet_tags
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_snippet_id ON snippet_tags(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_tag_id ON snippet_tags(tag_id);

-- Ensure unique snippet-tag combinations
CREATE UNIQUE INDEX IF NOT EXISTS idx_snippet_tags_unique 
  ON snippet_tags(snippet_id, tag_id);

-- Insert some default tags
INSERT INTO tags (name, color) VALUES 
  ('frontend', '#3b82f6'),
  ('backend', '#10b981'),
  ('database', '#8b5cf6'),
  ('api', '#f59e0b'),
  ('utility', '#6b7280'),
  ('algorithm', '#ef4444'),
  ('tutorial', '#06b6d4'),
  ('example', '#84cc16')
ON CONFLICT (name) DO NOTHING;