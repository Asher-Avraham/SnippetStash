
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilter } from '../components/TagFilter';
import type { Tag } from '../hooks/useSnippets';

describe('TagFilter', () => {
  const mockAvailableTags: Tag[] = [
    { id: '1', name: 'react', color: '#61DAFB' },
    { id: '2', name: 'javascript', color: '#F7DF1E' },
    { id: '3', name: 'css', color: '#264DE4' },
  ];

  it('renders nothing when there are no available tags', () => {
    const mockOnTagsChange = jest.fn();
    const { container } = render(
      <TagFilter selectedTags={[]} availableTags={[]} onTagsChange={mockOnTagsChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders available tags', () => {
    const mockOnTagsChange = jest.fn();
    render(
      <TagFilter selectedTags={[]} availableTags={mockAvailableTags} onTagsChange={mockOnTagsChange} />
    );
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('css')).toBeInTheDocument();
  });

  it('selects a tag when clicked', () => {
    const mockOnTagsChange = jest.fn();
    render(
      <TagFilter selectedTags={[]} availableTags={mockAvailableTags} onTagsChange={mockOnTagsChange} />
    );
    fireEvent.click(screen.getByText('react'));
    expect(mockOnTagsChange).toHaveBeenCalledWith([mockAvailableTags[0]]);
  });

  it('deselects a tag when clicked again', () => {
    const mockOnTagsChange = jest.fn();
    render(
      <TagFilter selectedTags={[mockAvailableTags[0]]} availableTags={mockAvailableTags} onTagsChange={mockOnTagsChange} />
    );
    fireEvent.click(screen.getByText('react'));
    expect(mockOnTagsChange).toHaveBeenCalledWith([]);
  });

  it('clears all selected tags when "Clear all" is clicked', () => {
    const mockOnTagsChange = jest.fn();
    render(
      <TagFilter selectedTags={[mockAvailableTags[0], mockAvailableTags[1]]} availableTags={mockAvailableTags} onTagsChange={mockOnTagsChange} />
    );
    fireEvent.click(screen.getByText('Clear all'));
    expect(mockOnTagsChange).toHaveBeenCalledWith([]);
  });
});
