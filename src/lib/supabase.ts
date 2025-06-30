import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Snippet = {
  id: string
  title: string
  content: string
  language: string
  is_public: boolean
  slug: string
  created_at: string
  updated_at: string
  is_favorited?: boolean
  tags?: Tag[]
}

export type Favorite = {
  id: string
  snippet_id: string
  user_id: string
  created_at: string
}

export type Tag = {
  id: string
  name: string
  color: string
  created_at: string
}

export type SnippetTag = {
  id: string
  snippet_id: string
  tag_id: string
  created_at: string
}