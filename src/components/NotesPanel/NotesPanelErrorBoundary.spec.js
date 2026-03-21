import React from 'react';
import { render, screen } from '@testing-library/react';

import NotesPanelErrorBoundary from './NotesPanelErrorBoundary';

const ThrowingChild = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <div>safe child</div>;
};

describe('NotesPanelErrorBoundary', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders fallback UI when a child throws', () => {
    const { container } = render(
      <NotesPanelErrorBoundary resetKey="notes-panel">
        <ThrowingChild shouldThrow />
      </NotesPanelErrorBoundary>
    );

    expect(container.querySelector('.no-annotations')).toBeInTheDocument();
    expect(screen.queryByText('safe child')).not.toBeInTheDocument();
  });

  it('resets error state when resetKey changes', () => {
    const { container, rerender } = render(
      <NotesPanelErrorBoundary resetKey="key-a">
        <ThrowingChild shouldThrow />
      </NotesPanelErrorBoundary>
    );

    expect(container.querySelector('.no-annotations')).toBeInTheDocument();

    rerender(
      <NotesPanelErrorBoundary resetKey="key-a">
        <ThrowingChild shouldThrow={false} />
      </NotesPanelErrorBoundary>
    );

    expect(container.querySelector('.no-annotations')).toBeInTheDocument();
    expect(screen.queryByText('safe child')).not.toBeInTheDocument();

    rerender(
      <NotesPanelErrorBoundary resetKey="key-b">
        <ThrowingChild shouldThrow={false} />
      </NotesPanelErrorBoundary>
    );

    expect(screen.getByText('safe child')).toBeInTheDocument();
    expect(container.querySelector('.no-annotations')).not.toBeInTheDocument();
  });
});
