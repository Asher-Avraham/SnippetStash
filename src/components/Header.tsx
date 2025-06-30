import React from 'react'
import { Code2, Plus, Star, Home } from 'lucide-react'

interface HeaderProps {
  onCreateSnippet: () => void
  currentView: 'all' | 'favorites'
  onViewChange: (view: 'all' | 'favorites') => void
}

export function Header({ onCreateSnippet, currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SnippetShare</h1>
              <p className="text-sm text-gray-400">Save and share your code</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => onViewChange('all')}
                className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  currentView === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                All Snippets
              </button>
              <button
                onClick={() => onViewChange('favorites')}
                className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  currentView === 'favorites'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Star className="h-4 w-4 mr-2" />
                Favorites
              </button>
            </nav>
            
            <button
              onClick={onCreateSnippet}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Snippet
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}