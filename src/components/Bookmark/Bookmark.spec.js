import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Basic } from './Bookmark.stories';

const BasicOutline = withProviders(Basic);

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  it('Double clicking on the title should show a renaming input', () => {
    const { container } = render(<BasicOutline />);
    const bookmarkElements = screen.getByRole('button', { name: 'Page 1' });

    let textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).toBeNull();

    fireEvent.doubleClick(bookmarkElements);
    textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).not.toBeNull();
  });
});
