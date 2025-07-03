
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnippetModal } from '../components/SnippetModal';
import type { Snippet } from '../hooks/useSnippets';

jest.mock('react-syntax-highlighter', () => ({
  Prism: () => <div data-testid="mocked-syntax-highlighter" />,
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
}));

jest.mock('../hooks/useTags', () => ({
  useTags: () => ({
    tags: [],
    createTag: jest.fn(),
  }),
}));

jest.mock('../components/TagInput', () => ({
  TagInput: () => <div data-testid="mocked-tag-input" />,
}));

describe('SnippetModal', () => {
  const mockLanguages = ['javascript', 'python', 'java'];
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SnippetModal
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
        languages={mockLanguages}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders in create mode when no snippet is provided', () => {
    render(
      <SnippetModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        languages={mockLanguages}
      />
    );
    expect(screen.getByText('Create New Snippet')).toBeInTheDocument();
  });

  it('renders in edit mode when a snippet is provided', () => {
    const mockSnippet: Snippet = {
      id: '1',
      title: 'Test Snippet',
      content: 'console.log("Hello, World!");',
      language: 'javascript',
      is_public: true,
      is_favorited: false,
      created_at: new Date().toISOString(),
      tags: [],
    };
    render(
      <SnippetModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        snippet={mockSnippet}
        languages={mockLanguages}
      />
    );
    expect(screen.getByText('Edit Snippet')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Snippet')).toBeInTheDocument();
  });

  it('calls onSave with the correct data when the save button is clicked', () => {
    render(
      <SnippetModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        languages={mockLanguages}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Enter snippet title...'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Paste your code here...'), { target: { value: 'New Content' } });
    fireEvent.click(screen.getByText('Save Snippet'));

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'New Title',
      content: 'New Content',
      language: 'javascript',
      is_public: false,
      tags: [],
    });
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <SnippetModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        languages={mockLanguages}
      />
    );
    fireEvent.click(screen.getByTitle('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
