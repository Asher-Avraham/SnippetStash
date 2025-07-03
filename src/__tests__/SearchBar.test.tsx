
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  const mockLanguages = ['javascript', 'python', 'java'];

  it('renders the search bar with an input and a language filter', () => {
    const mockOnSearchChange = jest.fn();
    const mockOnLanguageChange = jest.fn();
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        selectedLanguage=""
        onLanguageChange={mockOnLanguageChange}
        languages={mockLanguages}
      />
    );

    expect(screen.getByPlaceholderText('Search snippets...')).toBeInTheDocument();
    expect(screen.getByText('All Languages')).toBeInTheDocument();
  });

  it('calls onSearchChange when the search input changes', () => {
    const mockOnSearchChange = jest.fn();
    const mockOnLanguageChange = jest.fn();
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        selectedLanguage=""
        onLanguageChange={mockOnLanguageChange}
        languages={mockLanguages}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('test');
  });

  it('calls onLanguageChange when a language is selected', () => {
    const mockOnSearchChange = jest.fn();
    const mockOnLanguageChange = jest.fn();
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        selectedLanguage=""
        onLanguageChange={mockOnLanguageChange}
        languages={mockLanguages}
      />
    );

    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'python' } });
    expect(mockOnLanguageChange).toHaveBeenCalledWith('python');
  });
});
