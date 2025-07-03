
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationContainer } from '../components/NotificationContainer';

describe('NotificationContainer', () => {
  const mockNotifications = [
    { id: '1', type: 'success', message: 'Success message' },
    { id: '2', type: 'error', message: 'Error message' },
  ];

  it('renders nothing when there are no notifications', () => {
    const mockOnRemove = jest.fn();
    const { container } = render(<NotificationContainer notifications={[]} onRemove={mockOnRemove} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders a single notification', () => {
    const mockOnRemove = jest.fn();
    render(<NotificationContainer notifications={[mockNotifications[0]]} onRemove={mockOnRemove} />);
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders multiple notifications', () => {
    const mockOnRemove = jest.fn();
    render(<NotificationContainer notifications={mockNotifications} onRemove={mockOnRemove} />);
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('calls onRemove when a notification is dismissed', () => {
    const mockOnRemove = jest.fn();
    render(<NotificationContainer notifications={mockNotifications} onRemove={mockOnRemove} />);
    
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);
    
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });
});
