
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../components/EmptyState';

describe('EmptyState', () => {
  it('renders the default empty state', () => {
    const mockOnCreateSnippet = jest.fn();
    render(<EmptyState onCreateSnippet={mockOnCreateSnippet} />);
    expect(screen.getByText('No snippets yet')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Snippet')).toBeInTheDocument();
  });

  it('renders the searching state', () => {
    const mockOnCreateSnippet = jest.fn();
    render(<EmptyState onCreateSnippet={mockOnCreateSnippet} isSearching />);
    expect(screen.getByText('No snippets found')).toBeInTheDocument();
  });

  it('renders the favorites view empty state', () => {
    const mockOnCreateSnippet = jest.fn();
    render(<EmptyState onCreateSnippet={mockOnCreateSnippet} isFavoritesView />);
    expect(screen.getByText('No favorite snippets yet')).toBeInTheDocument();
  });

  it('calls onCreateSnippet when the button is clicked', () => {
    const mockOnCreateSnippet = jest.fn();
    render(<EmptyState onCreateSnippet={mockOnCreateSnippet} />);
    fireEvent.click(screen.getByText('Create Your First Snippet'));
    expect(mockOnCreateSnippet).toHaveBeenCalledTimes(1);
  });
});
