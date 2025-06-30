import { useState, useEffect } from 'react'
import { supabase, type Favorite } from '../lib/supabase'

// For now, we'll use a static user ID since we don't have authentication
// Using a valid UUID format to match the database schema
const CURRENT_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', CURRENT_USER_ID)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFavorites(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (snippetId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ snippet_id: snippetId, user_id: CURRENT_USER_ID }])
        .select()
        .single()

      if (error) throw error
      setFavorites(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites')
      throw err
    }
  }

  const removeFromFavorites = async (snippetId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('snippet_id', snippetId)
        .eq('user_id', CURRENT_USER_ID)

      if (error) throw error
      setFavorites(prev => prev.filter(f => f.snippet_id !== snippetId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites')
      throw err
    }
  }

  const isFavorited = (snippetId: string) => {
    return favorites.some(f => f.snippet_id === snippetId)
  }

  const toggleFavorite = async (snippetId: string) => {
    if (isFavorited(snippetId)) {
      await removeFromFavorites(snippetId)
    } else {
      await addToFavorites(snippetId)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    toggleFavorite,
    refetch: fetchFavorites
  }
}