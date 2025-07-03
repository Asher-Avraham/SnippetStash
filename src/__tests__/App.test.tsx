import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('react-syntax-highlighter', () => ({
  Prism: () => <div data-testid="mocked-syntax-highlighter" />,
}));

jest.mock('../hooks/useSnippets', () => ({
  useSnippets: () => ({
    snippets: [],
    loading: false,
    createSnippet: jest.fn(),
    updateSnippet: jest.fn(),
    deleteSnippet: jest.fn(),
    refetch: jest.fn(),
    fetchFavorites: jest.fn(),
  }),
}));

jest.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    toggleFavorite: jest.fn(),
  }),
}));

jest.mock('../hooks/useTags', () => ({
  useTags: () => ({
    tags: [],
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

jest.mock('../components/Header', () => ({
  Header: () => <header role="banner">Mocked Header</header>,
}));

jest.mock('../components/SearchBar', () => ({
  SearchBar: () => <div>Mocked SearchBar</div>,
}));

jest.mock('../components/TagFilter', () => ({
  TagFilter: () => <div>Mocked TagFilter</div>,
}));

jest.mock('../components/SnippetCard', () => ({
  SnippetCard: () => <div>Mocked SnippetCard</div>,
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

describe('App', () => {
  it('renders the main application header', () => {
    render(<App />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });
});