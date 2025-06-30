import { useState, useEffect } from 'react'
import { supabase, type Snippet } from '../lib/supabase'

// For now, we'll use a static user ID since we don't have authentication
// Using a valid UUID format to match the database schema
const CURRENT_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSnippets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('snippets')
        .select(`
          *,
          favorites!left(id),
          snippet_tags!left(
            tag_id,
            tags(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Process snippets with favorites and tags
      const processedSnippets = (data || []).map(snippet => ({
        ...snippet,
        is_favorited: snippet.favorites && snippet.favorites.length > 0,
        tags: snippet.snippet_tags?.map((st: any) => st.tags).filter(Boolean) || []
      }))
      
      setSnippets(processedSnippets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching snippets:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavoriteSnippets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          snippets (
            *,
            snippet_tags!left(
              tag_id,
              tags(*)
            )
          )
        `)
        .eq('user_id', CURRENT_USER_ID)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Extract snippets from favorites and mark them as favorited
      const favoriteSnippets = (data || [])
        .filter(fav => fav.snippets)
        .map(fav => ({
          ...fav.snippets,
          is_favorited: true,
          tags: fav.snippets.snippet_tags?.map((st: any) => st.tags).filter(Boolean) || []
        }))
      
      setSnippets(favoriteSnippets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching favorite snippets:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSnippet = async (snippetData: Partial<Snippet>) => {
    try {
      const slug = generateSlug(snippetData.title || '')
      const { tags, ...snippetWithoutTags } = snippetData
      
      const { data, error } = await supabase
        .from('snippets')
        .insert([{ ...snippetWithoutTags, slug }])
        .select()
        .single()

      if (error) throw error

      // Add tags if provided
      if (tags && tags.length > 0) {
        const tagInserts = tags.map(tag => ({
          snippet_id: data.id,
          tag_id: tag.id
        }))

        const { error: tagError } = await supabase
          .from('snippet_tags')
          .insert(tagInserts)

        if (tagError) throw tagError
      }

      const newSnippet = { ...data, tags: tags || [] }
      setSnippets(prev => [newSnippet, ...prev])
      return newSnippet
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create snippet')
      throw err
    }
  }

  const updateSnippet = async (id: string, snippetData: Partial<Snippet>) => {
    try {
      const { tags, ...snippetWithoutTags } = snippetData
      
      const { data, error } = await supabase
        .from('snippets')
        .update({ ...snippetWithoutTags, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Update tags if provided
      if (tags !== undefined) {
        // Remove existing tags
        await supabase
          .from('snippet_tags')
          .delete()
          .eq('snippet_id', id)

        // Add new tags
        if (tags.length > 0) {
          const tagInserts = tags.map(tag => ({
            snippet_id: id,
            tag_id: tag.id
          }))

          const { error: tagError } = await supabase
            .from('snippet_tags')
            .insert(tagInserts)

          if (tagError) throw tagError
        }
      }

      const updatedSnippet = { 
        ...data, 
        tags: tags || snippets.find(s => s.id === id)?.tags || [],
        is_favorited: snippets.find(s => s.id === id)?.is_favorited || false
      }
      
      setSnippets(prev => prev.map(s => s.id === id ? updatedSnippet : s))
      return updatedSnippet
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update snippet')
      throw err
    }
  }

  const deleteSnippet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSnippets(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete snippet')
      throw err
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substr(2, 6)
  }

  useEffect(() => {
    fetchSnippets()
  }, [])

  return {
    snippets,
    loading,
    error,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    refetch: fetchSnippets,
    fetchFavorites: fetchFavoriteSnippets
  }
}