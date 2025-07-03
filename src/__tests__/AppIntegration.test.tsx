
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import type { Snippet, Tag } from '../hooks/useSnippets';

// Mock all child components and hooks to isolate the integration logic
jest.mock('react-syntax-highlighter', () => ({
  Prism: () => <div data-testid="mocked-syntax-highlighter" />,
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
}));

jest.mock('../components/Header', () => ({
  Header: ({ onCreateSnippet, currentView, onViewChange }: any) => (
    <header role="banner">
      <button onClick={onCreateSnippet}>New Snippet</button>
      <button onClick={() => onViewChange('all')}>All Snippets</button>
      <button onClick={() => onViewChange('favorites')}>Favorites</button>
    </header>
  ),
}));

jest.mock('../components/SearchBar', () => ({
  SearchBar: ({ searchTerm, onSearchChange, selectedLanguage, onLanguageChange, languages }: any) => (
    <div>
      <input
        placeholder="Search snippets..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        data-testid="search-input"
      />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        data-testid="language-select"
      >
        <option value="">All Languages</option>
        {languages.map((lang: string) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('../components/TagFilter', () => ({
  TagFilter: ({ selectedTags, availableTags, onTagsChange }: any) => (
    <div>
      {availableTags.map((tag: Tag) => (
        <button
          key={tag.id}
          onClick={() => {
            const isSelected = selectedTags.some((t: Tag) => t.id === tag.id);
            onTagsChange(isSelected ? selectedTags.filter((t: Tag) => t.id !== tag.id) : [...selectedTags, tag]);
          }}
          data-testid={`tag-filter-${tag.name}`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../components/SnippetCard', () => ({
  SnippetCard: ({ snippet }: any) => (
    <div data-testid={`snippet-card-${snippet.id}`}>
      <h3>{snippet.title}</h3>
      <p>{snippet.language}</p>
      {snippet.tags && snippet.tags.map((tag: Tag) => <span key={tag.id}>{tag.name}</span>)}
    </div>
  ),
}));

jest.mock('../components/SnippetModal', () => ({
  SnippetModal: () => <div>Mocked SnippetModal</div>,
}));

jest.mock('../components/EmptyState', () => ({
  EmptyState: () => <div>Mocked EmptyState</div>,
}));

jest.mock('../components/NotificationContainer', () => ({
  NotificationContainer: () => <div>Mocked NotificationContainer</div>,
}));

jest.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    toggleFavorite: jest.fn(),
  }),
}));

jest.mock('../hooks/useNotification', () => ({
  useNotification: () => ({
    notifications: [],
    removeNotification: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock('../hooks/useTags', () => ({
  useTags: () => ({
    tags: [
      { id: 'tag1', name: 'react', color: '#000' },
      { id: 'tag2', name: 'typescript', color: '#000' },
      { id: 'tag3', name: 'frontend', color: '#000' },
    ],
    createTag: jest.fn(),
  }),
}));

const mockSnippets: Snippet[] = [
  {
    id: '1',
    title: 'React Component',
    content: '<div>React</div>',
    language: 'javascript',
    is_public: true,
    is_favorited: false,
    created_at: '2023-01-01T00:00:00Z',
    tags: [{ id: 'tag1', name: 'react', color: '#000' }, { id: 'tag3', name: 'frontend', color: '#000' }],
  },
  {
    id: '2',
    title: 'TypeScript Utility',
    content: 'function util() {}',
    language: 'typescript',
    is_public: true,
    is_favorited: false,
    created_at: '2023-01-02T00:00:00Z',
    tags: [{ id: 'tag2', name: 'typescript', color: '#000' }, { id: 'tag3', name: 'frontend', color: '#000' }],
  },
  {
    id: '3',
    title: 'Backend Logic',
    content: 'console.log("backend")',
    language: 'python',
    is_public: true,
    is_favorited: false,
    created_at: '2023-01-03T00:00:00Z',
    tags: [],
  },
];

jest.mock('../hooks/useSnippets', () => ({
  useSnippets: () => ({
    snippets: mockSnippets,
    loading: false,
    createSnippet: jest.fn(),
    updateSnippet: jest.fn(),
    deleteSnippet: jest.fn(),
    refetch: jest.fn(() => Promise.resolve(mockSnippets)),
    fetchFavorites: jest.fn(() => Promise.resolve(mockSnippets.filter(s => s.is_favorited))),
  }),
}));

describe('App Integration - Filtering', () => {
  it('filters snippets by search term', () => {
    render(<App />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    expect(screen.getByText('React Component')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript Utility')).not.toBeInTheDocument();
    expect(screen.queryByText('Backend Logic')).not.toBeInTheDocument();
  });

  it('filters snippets by language', () => {
    render(<App />);
    const languageSelect = screen.getByTestId('language-select');
    fireEvent.change(languageSelect, { target: { value: 'typescript' } });

    expect(screen.queryByText('React Component')).not.toBeInTheDocument();
    expect(screen.getByText('TypeScript Utility')).toBeInTheDocument();
    expect(screen.queryByText('Backend Logic')).not.toBeInTheDocument();
  });

  it('filters snippets by tags', () => {
    render(<App />);
    const frontendTagButton = screen.getByTestId('tag-filter-frontend');
    fireEvent.click(frontendTagButton);

    expect(screen.getByText('React Component')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Utility')).toBeInTheDocument();
    expect(screen.queryByText('Backend Logic')).not.toBeInTheDocument();
  });

  it('filters snippets by search term and language combined', () => {
    render(<App />);
    const searchInput = screen.getByTestId('search-input');
    const languageSelect = screen.getByTestId('language-select');

    fireEvent.change(searchInput, { target: { value: 'Component' } });
    fireEvent.change(languageSelect, { target: { value: 'javascript' } });

    expect(screen.getByText('React Component')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript Utility')).not.toBeInTheDocument();
    expect(screen.queryByText('Backend Logic')).not.toBeInTheDocument();
  });

  it('filters snippets by search term, language, and tags combined', () => {
    render(<App />);
    const searchInput = screen.getByTestId('search-input');
    const languageSelect = screen.getByTestId('language-select');
    const reactTagButton = screen.getByTestId('tag-filter-react');

    fireEvent.change(searchInput, { target: { value: 'Component' } });
    fireEvent.change(languageSelect, { target: { value: 'javascript' } });
    fireEvent.click(reactTagButton);

    expect(screen.getByText('React Component')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript Utility')).not.toBeInTheDocument();
    expect(screen.queryByText('Backend Logic')).not.toBeInTheDocument();
  });
});
