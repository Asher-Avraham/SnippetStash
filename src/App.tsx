import React, { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { TagFilter } from './components/TagFilter'
import { SnippetCard } from './components/SnippetCard'
import { SnippetModal } from './components/SnippetModal'
import { EmptyState } from './components/EmptyState'
import { NotificationContainer } from './components/NotificationContainer'
import { useSnippets } from './hooks/useSnippets'
import { useFavorites } from './hooks/useFavorites'
import { useTags } from './hooks/useTags'
import { useNotification } from './hooks/useNotification'
import type { Snippet, Tag } from './hooks/useSnippets'

const PROGRAMMING_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'html',
  'css', 'sql', 'bash', 'powershell', 'json', 'yaml', 'xml'
]

function App() {
  const { snippets, loading, createSnippet, updateSnippet, deleteSnippet, refetch, fetchFavorites } = useSnippets()
  const { toggleFavorite } = useFavorites()
  const { tags } = useTags()
  const { notifications, removeNotification, success, error } = useNotification()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [currentView, setCurrentView] = useState<'all' | 'favorites'>('all')

  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet => {
      const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           snippet.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(selectedTag => 
                           snippet.tags?.some(snippetTag => snippetTag.id === selectedTag.id)
                         )
      return matchesSearch && matchesLanguage && matchesTags
    })
  }, [snippets, searchTerm, selectedLanguage, selectedTags])

  const availableLanguages = useMemo(() => {
    const usedLanguages = Array.from(new Set(snippets.map(s => s.language)))
    return PROGRAMMING_LANGUAGES.filter(lang => usedLanguages.includes(lang))
  }, [snippets])

  const availableTagsForFilter = useMemo(() => {
    const usedTagIds = new Set()
    snippets.forEach(snippet => {
      snippet.tags?.forEach(tag => usedTagIds.add(tag.id))
    })
    return tags.filter(tag => usedTagIds.has(tag.id))
  }, [snippets, tags])

  const handleViewChange = async (view: 'all' | 'favorites') => {
    setCurrentView(view)
    setSearchTerm('')
    setSelectedLanguage('')
    setSelectedTags([])
    
    if (view === 'favorites') {
      await fetchFavorites()
    } else {
      await refetch()
    }
  }

  const handleCreateSnippet = () => {
    setEditingSnippet(null)
    setIsModalOpen(true)
  }

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet)
    setIsModalOpen(true)
  }

  const handleSaveSnippet = async (snippetData: Partial<Snippet>) => {
    try {
      if (editingSnippet) {
        await updateSnippet(editingSnippet.id, snippetData)
        success('Snippet updated successfully!')
      } else {
        await createSnippet(snippetData)
        success('Snippet created successfully!')
      }
      setIsModalOpen(false)
      setEditingSnippet(null)
    } catch (err) {
      error('Failed to save snippet. Please try again.')
    }
  }

  const handleDeleteSnippet = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteSnippet(id)
        success('Snippet deleted successfully!')
      } catch (err) {
        error('Failed to delete snippet. Please try again.')
      }
    }
  }

  const handleCopySnippet = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      success('Code copied to clipboard!')
    } catch (err) {
      error('Failed to copy code to clipboard.')
    }
  }

  const handleToggleFavorite = async (snippetId: string, isFavorited: boolean) => {
    try {
      await toggleFavorite(snippetId, isFavorited)
      const snippet = snippets.find(s => s.id === snippetId)
      if (snippet?.is_favorited) {
        success('Removed from favorites!')
      } else {
        success('Added to favorites!')
      }
      
      // Refresh the current view
      if (currentView === 'favorites') {
        await fetchFavorites()
      } else {
        await refetch()
      }
    } catch (err) {
      error('Failed to update favorites. Please try again.')
    }
  }

  const isSearching = searchTerm.trim() !== '' || selectedLanguage !== '' || selectedTags.length > 0

  return (
    <div className="min-h-screen bg-gray-950">
      <Header 
        onCreateSnippet={handleCreateSnippet} 
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        languages={availableLanguages}
      />

      {availableTagsForFilter.length > 0 && (
        <TagFilter
          selectedTags={selectedTags}
          availableTags={availableTagsForFilter}
          onTagsChange={setSelectedTags}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <EmptyState 
            onCreateSnippet={handleCreateSnippet} 
            isSearching={isSearching}
            isFavoritesView={currentView === 'favorites'}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onEdit={handleEditSnippet}
                onDelete={handleDeleteSnippet}
                onCopy={handleCopySnippet}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <SnippetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSnippet(null)
        }}
        onSave={handleSaveSnippet}
        snippet={editingSnippet}
        languages={PROGRAMMING_LANGUAGES}
      />

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}

export default App