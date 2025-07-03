
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnippetCard } from '../components/SnippetCard';
import type { Snippet } from '../hooks/useSnippets';

jest.mock('react-syntax-highlighter', () => ({
  Prism: () => <div data-testid="mocked-syntax-highlighter" />,
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
}));

describe('SnippetCard', () => {
  const mockSnippet: Snippet = {
    id: '1',
    title: 'Test Snippet',
    content: 'console.log("Hello, World!");',
    language: 'javascript',
    is_public: true,
    is_favorited: false,
    created_at: new Date().toISOString(),
    tags: [{ id: '1', name: 'test', color: '#ffffff' }],
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCopy = jest.fn();
  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    render(
      <SnippetCard
        snippet={mockSnippet}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCopy={mockOnCopy}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );
  });

  it('renders the snippet card with title, language, and date', () => {
    expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText(new Date(mockSnippet.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))).toBeInTheDocument();
  });

  it('calls onEdit when the edit button is clicked', () => {
    fireEvent.click(screen.getByTitle('Edit snippet'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockSnippet);
  });

  it('calls onDelete when the delete button is clicked', () => {
    fireEvent.click(screen.getByTitle('Delete snippet'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onCopy when the copy button is clicked', () => {
    fireEvent.click(screen.getByTitle('Copy code'));
    expect(mockOnCopy).toHaveBeenCalledWith(mockSnippet.content);
  });

  it('calls onToggleFavorite when the favorite button is clicked', () => {
    fireEvent.click(screen.getByTitle('Add to favorites'));
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('1', false);
  });
});
