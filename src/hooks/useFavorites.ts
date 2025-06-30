const API_URL = '/api';

// For now, we'll use a static user ID since we don't have authentication
// Using a valid UUID format to match the database schema
const CURRENT_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

export interface Favorite {
  id: string;
  snippet_id: string;
  user_id: string;
  created_at: string;
}

export function useFavorites() {
  const addToFavorites = async (snippetId: string) => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippet_id: snippetId, user_id: CURRENT_USER_ID }),
      });
      if (!response.ok) throw new Error('Failed to add to favorites');
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeFromFavorites = async (snippetId: string) => {
    try {
      const response = await fetch(`${API_URL}/favorites/${snippetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from favorites');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const toggleFavorite = async (snippetId: string, isFavorited: boolean) => {
    if (isFavorited) {
      await removeFromFavorites(snippetId);
    } else {
      await addToFavorites(snippetId);
    }
  };

  return {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
}
