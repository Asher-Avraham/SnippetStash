
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';

describe('Header', () => {
  it('renders the header with title and buttons', () => {
    const mockOnCreateSnippet = jest.fn();
    const mockOnViewChange = jest.fn();
    render(<Header onCreateSnippet={mockOnCreateSnippet} currentView="all" onViewChange={mockOnViewChange} />);
    
    expect(screen.getByText('SnippetShare')).toBeInTheDocument();
    expect(screen.getByText('All Snippets')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('New Snippet')).toBeInTheDocument();
  });

  it('calls onCreateSnippet when the "New Snippet" button is clicked', () => {
    const mockOnCreateSnippet = jest.fn();
    const mockOnViewChange = jest.fn();
    render(<Header onCreateSnippet={mockOnCreateSnippet} currentView="all" onViewChange={mockOnViewChange} />);
    
    fireEvent.click(screen.getByText('New Snippet'));
    expect(mockOnCreateSnippet).toHaveBeenCalledTimes(1);
  });

  it('calls onViewChange with "favorites" when the "Favorites" button is clicked', () => {
    const mockOnCreateSnippet = jest.fn();
    const mockOnViewChange = jest.fn();
    render(<Header onCreateSnippet={mockOnCreateSnippet} currentView="all" onViewChange={mockOnViewChange} />);
    
    fireEvent.click(screen.getByText('Favorites'));
    expect(mockOnViewChange).toHaveBeenCalledWith('favorites');
  });

  it('calls onViewChange with "all" when the "All Snippets" button is clicked', () => {
    const mockOnCreateSnippet = jest.fn();
    const mockOnViewChange = jest.fn();
    render(<Header onCreateSnippet={mockOnCreateSnippet} currentView="favorites" onViewChange={mockOnViewChange} />);
    
    fireEvent.click(screen.getByText('All Snippets'));
    expect(mockOnViewChange).toHaveBeenCalledWith('all');
  });
});
