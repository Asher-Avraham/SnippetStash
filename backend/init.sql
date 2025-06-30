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

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  user_id uuid DEFAULT gen_random_uuid(), -- Placeholder for future auth
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#6366f1', -- Default indigo color
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS snippet_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_slug ON snippets(slug);
CREATE INDEX IF NOT EXISTS idx_snippets_public ON snippets(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_favorites_snippet_id ON favorites(snippet_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_snippet ON favorites(user_id, snippet_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique_user_snippet ON favorites(user_id, snippet_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_snippet_id ON snippet_tags(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_tag_id ON snippet_tags(tag_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_snippet_tags_unique ON snippet_tags(snippet_id, tag_id);

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
