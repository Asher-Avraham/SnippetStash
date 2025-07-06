import React, { useState, useEffect } from 'react'
import { X, Save, Eye, EyeOff } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { TagInput } from './TagInput'
import { useTags } from '../hooks/useTags'
import type { Snippet, Tag } from '../hooks/useSnippets'

interface SnippetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (snippet: Partial<Snippet>) => void
  snippet?: Snippet | null
  languages: string[]
}

export function SnippetModal({ isOpen, onClose, onSave, snippet, languages }: SnippetModalProps) {
  const { tags: availableTags, createTag } = useTags()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title)
      setContent(snippet.content)
      setLanguage(snippet.language)
      setIsPublic(snippet.is_public)
      setSelectedTags(snippet.tags || [])
    } else {
      setTitle('')
      setContent('')
      setLanguage('javascript')
      setIsPublic(false)
      setSelectedTags([])
    }
    setIsPreview(false)
  }, [snippet, isOpen])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const snippetData: Partial<Snippet> = {
      title: title.trim(),
      content: content.trim(),
      language,
      is_public: isPublic,
      tags: selectedTags,
    }

    if (snippet) {
      snippetData.id = snippet.id
    }

    onSave(snippetData)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {snippet ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isPreview 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={isPreview ? 'Show editor' : 'Show preview'}
            >
              {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter snippet title..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                data-cy="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <TagInput
              selectedTags={selectedTags}
              availableTags={availableTags}
              onTagsChange={setSelectedTags}
              onCreateTag={createTag}
              placeholder="Add tags to organize your snippet..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-300">
              Make this snippet public
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Code
            </label>
            {isPreview ? (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    minHeight: '300px',
                    background: 'rgb(31, 41, 55)',
                  }}
                  showLineNumbers={true}
                >
                  {content || '// Your code will appear here...'}
                </SyntaxHighlighter>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your code here..."
                rows={15}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Press Ctrl/Cmd + S to save
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              {snippet ? 'Update' : 'Save'} Snippet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}