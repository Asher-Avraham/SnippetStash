import { useState, useEffect } from 'react'
import { supabase, type Tag } from '../lib/supabase'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setTags(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching tags:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTag = async (name: string, color: string = '#6366f1') => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name: name.toLowerCase().trim(), color }])
        .select()
        .single()

      if (error) throw error
      setTags(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag')
      throw err
    }
  }

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTags(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag')
      throw err
    }
  }

  const addTagToSnippet = async (snippetId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('snippet_tags')
        .insert([{ snippet_id: snippetId, tag_id: tagId }])

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tag to snippet')
      throw err
    }
  }

  const removeTagFromSnippet = async (snippetId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('snippet_tags')
        .delete()
        .eq('snippet_id', snippetId)
        .eq('tag_id', tagId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove tag from snippet')
      throw err
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return {
    tags,
    loading,
    error,
    createTag,
    deleteTag,
    addTagToSnippet,
    removeTagFromSnippet,
    refetch: fetchTags
  }
}