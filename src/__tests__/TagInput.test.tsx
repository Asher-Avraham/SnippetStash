
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TagInput } from '../components/TagInput';
import type { Tag } from '../hooks/useSnippets';

describe('TagInput', () => {
  const mockAvailableTags: Tag[] = [
    { id: '1', name: 'react', color: '#61DAFB' },
    { id: '2', name: 'javascript', color: '#F7DF1E' },
    { id: '3', name: 'css', color: '#264DE4' },
  ];

  const mockSelectedTags: Tag[] = [
    { id: '4', name: 'html', color: '#E34C26' },
  ];

  const mockOnTagsChange = jest.fn();
  const mockOnCreateTag = jest.fn((name: string) => Promise.resolve({ id: 'new', name, color: '#000000' }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with selected tags', () => {
    render(
      <TagInput
        selectedTags={mockSelectedTags}
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    expect(screen.getByText('html')).toBeInTheDocument();
  });

  it('shows available tags in dropdown when input is focused', () => {
    render(
      <TagInput
        selectedTags={[]} // No selected tags initially
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText('Add tags...');
    fireEvent.focus(input);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('css')).toBeInTheDocument();
  });

  it('filters available tags based on input value', () => {
    render(
      <TagInput
        selectedTags={[]} // No selected tags initially
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(input, { target: { value: 'java' } });
    expect(screen.queryByText('react')).not.toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('calls onTagsChange when an available tag is selected', () => {
    render(
      <TagInput
        selectedTags={[]} // No selected tags initially
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.click(screen.getByText('react'));
    expect(mockOnTagsChange).toHaveBeenCalledWith([mockAvailableTags[0]]);
  });

  it('calls onTagsChange when a selected tag is removed', () => {
    render(
      <TagInput
        selectedTags={mockSelectedTags}
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /remove html tag/i }));
    expect(mockOnTagsChange).toHaveBeenCalledWith([]);
  });

  it('calls onCreateTag and onTagsChange when a new tag is created', async () => {
    render(
      <TagInput
        selectedTags={[]} // No selected tags initially
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(input, { target: { value: 'newtag' } });
    fireEvent.click(screen.getByText('Create "newtag"'));

    await waitFor(() => {
      expect(mockOnCreateTag).toHaveBeenCalledWith('newtag');
      expect(mockOnTagsChange).toHaveBeenCalledWith([{ id: 'new', name: 'newtag', color: '#000000' }]);
    });
  });

  it('handles Enter key to select existing tag', () => {
    render(
      <TagInput
        selectedTags={[]} // No selected tags initially
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnTagsChange).toHaveBeenCalledWith([mockAvailableTags[0]]);
  });

  it('handles Enter key to create new tag', async () => {
    render(
      <TagInput
        selectedTags={[]} // No selected tags initially
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(input, { target: { value: 'brandnew' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnCreateTag).toHaveBeenCalledWith('brandnew');
    });
  });

  it('handles Backspace key to remove last selected tag', () => {
    render(
      <TagInput
        selectedTags={mockSelectedTags}
        availableTags={mockAvailableTags}
        onTagsChange={mockOnTagsChange}
        onCreateTag={mockOnCreateTag}
      />
    );
    const input = screen.getByPlaceholderText(''); // Placeholder changes when tags are selected
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
    expect(mockOnTagsChange).toHaveBeenCalledWith([]);
  });
});
