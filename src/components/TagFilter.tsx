import React from 'react'
import { X, Tag as TagIcon } from 'lucide-react'
import type { Tag } from '../lib/supabase'

interface TagFilterProps {
  selectedTags: Tag[]
  availableTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}

export function TagFilter({ selectedTags, availableTags, onTagsChange }: TagFilterProps) {
  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(selected => selected.id === tag.id)
    if (isSelected) {
      onTagsChange(selectedTags.filter(selected => selected.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleClearAll = () => {
    onTagsChange([])
  }

  if (availableTags.length === 0) return null

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <TagIcon className="h-4 w-4 mr-2" />
            Filter by Tags
          </h3>
          {selectedTags.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => {
            const isSelected = selectedTags.some(selected => selected.id === tag.id)
            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'text-white ring-2 ring-white/20'
                    : 'text-gray-300 hover:text-white hover:ring-1 hover:ring-gray-600'
                }`}
                style={{ 
                  backgroundColor: isSelected ? tag.color : `${tag.color}20`,
                  borderColor: tag.color
                }}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag.name}
                {isSelected && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}