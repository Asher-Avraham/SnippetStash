import React, { useState, useRef, useEffect } from 'react'
import { X, Plus, Tag as TagIcon } from 'lucide-react'
import type { Tag } from '../lib/supabase'

interface TagInputProps {
  selectedTags: Tag[]
  availableTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  onCreateTag: (name: string) => Promise<Tag>
  placeholder?: string
}

export function TagInput({ 
  selectedTags, 
  availableTags, 
  onTagsChange, 
  onCreateTag,
  placeholder = "Add tags..."
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredTags = availableTags.filter(tag => 
    !selectedTags.some(selected => selected.id === tag.id) &&
    tag.name.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsDropdownOpen(true)
  }

  const handleTagSelect = (tag: Tag) => {
    onTagsChange([...selectedTags, tag])
    setInputValue('')
    setIsDropdownOpen(false)
    inputRef.current?.focus()
  }

  const handleTagRemove = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id))
  }

  const handleCreateTag = async () => {
    if (!inputValue.trim() || isCreating) return
    
    try {
      setIsCreating(true)
      const newTag = await onCreateTag(inputValue.trim())
      onTagsChange([...selectedTags, newTag])
      setInputValue('')
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredTags.length > 0) {
        handleTagSelect(filteredTags[0])
      } else if (inputValue.trim()) {
        handleCreateTag()
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleTagRemove(selectedTags[selectedTags.length - 1])
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
            style={{ backgroundColor: tag.color }}
          >
            <TagIcon className="h-3 w-3 mr-1" />
            {tag.name}
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-400 outline-none"
        />
      </div>

      {isDropdownOpen && (filteredTags.length > 0 || inputValue.trim()) && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagSelect(tag)}
              className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex items-center"
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-white">{tag.name}</span>
            </button>
          ))}
          
          {inputValue.trim() && !filteredTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
            <button
              type="button"
              onClick={handleCreateTag}
              disabled={isCreating}
              className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex items-center text-indigo-400 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : `Create "${inputValue.trim()}"`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}