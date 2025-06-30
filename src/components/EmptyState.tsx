import React from 'react'
import { Code2, Plus, Star } from 'lucide-react'

interface EmptyStateProps {
  onCreateSnippet: () => void
  isSearching?: boolean
  isFavoritesView?: boolean
}

export function EmptyState({ onCreateSnippet, isSearching = false, isFavoritesView = false }: EmptyStateProps) {
  if (isSearching) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Code2 className="h-8 w-8 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No snippets found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  if (isFavoritesView) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Star className="h-8 w-8 text-white mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No favorite snippets yet</h3>
          <p className="text-gray-400 mb-6">
            Start adding snippets to your favorites by clicking the star icon on any snippet card.
          </p>
          <button
            onClick={onCreateSnippet}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Snippet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-indigo-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
          <Code2 className="h-8 w-8 text-white mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No snippets yet</h3>
        <p className="text-gray-400 mb-6">
          Get started by creating your first code snippet. Save and organize your code for easy access and sharing.
        </p>
        <button
          onClick={onCreateSnippet}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Snippet
        </button>
      </div>
    </div>
  )
}