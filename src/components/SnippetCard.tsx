import React from 'react'
import { Calendar, Code, Globe, Lock, Copy, Edit3, Trash2, Star, Tag as TagIcon } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Snippet } from '../hooks/useSnippets'

interface SnippetCardProps {
  snippet: Snippet
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onCopy: (content: string) => void
  onToggleFavorite: (id: string, isFavorited: boolean) => void
}

export function SnippetCard({ snippet, onEdit, onDelete, onCopy, onToggleFavorite }: SnippetCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLanguageIcon = (language: string) => {
    return <Code className="h-4 w-4" />
  }

  const truncateContent = (content: string, maxLines: number = 10) => {
    const lines = content.split('\n')
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + '\n...'
    }
    return content
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200 group">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {snippet.title}
            </h3>
            
            {/* Tags */}
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {snippet.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                {getLanguageIcon(snippet.language)}
                <span className="capitalize">{snippet.language}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(snippet.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                {snippet.is_public ? (
                  <Globe className="h-4 w-4 text-green-400" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <span>{snippet.is_public ? 'Public' : 'Private'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onToggleFavorite(snippet.id, snippet.is_favorited)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                snippet.is_favorited
                  ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10'
                  : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
              }`}
              title={snippet.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`h-4 w-4 ${snippet.is_favorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onCopy(snippet.content)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(snippet)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Edit snippet"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(snippet.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Delete snippet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <div className="border-t border-gray-700">
        <div className="relative">
          <SyntaxHighlighter
            language={snippet.language.toLowerCase()}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '16px',
              background: 'rgb(31, 41, 55)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {truncateContent(snippet.content)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}