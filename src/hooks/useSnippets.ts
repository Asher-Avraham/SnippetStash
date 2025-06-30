import { useState, useEffect } from 'react';

// Define the types based on the new API response
export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  language: string;
  is_public: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  is_favorited: boolean;
  tags: Tag[];
}

const API_URL = '/api';

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/snippets`);
      if (!response.ok) throw new Error('Failed to fetch snippets');
      const data = await response.json();
      setSnippets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteSnippets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/favorites`);
      if (!response.ok) throw new Error('Failed to fetch favorite snippets');
      const data = await response.json();
      setSnippets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSnippet = async (snippetData: Partial<Snippet>) => {
    try {
      const response = await fetch(`${API_URL}/snippets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippetData),
      });
      if (!response.ok) throw new Error('Failed to create snippet');
      const newSnippet = await response.json();
      fetchSnippets(); // Refetch to get the latest list
      return newSnippet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create snippet');
      throw err;
    }
  };

  const updateSnippet = async (id: string, snippetData: Partial<Snippet>) => {
    try {
      const response = await fetch(`${API_URL}/snippets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippetData),
      });
      if (!response.ok) throw new Error('Failed to update snippet');
      const updatedSnippet = await response.json();
      fetchSnippets(); // Refetch to get the latest list
      return updatedSnippet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update snippet');
      throw err;
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/snippets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete snippet');
      setSnippets(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete snippet');
      throw err;
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  return {
    snippets,
    loading,
    error,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    refetch: fetchSnippets,
    fetchFavorites: fetchFavoriteSnippets,
  };
}
