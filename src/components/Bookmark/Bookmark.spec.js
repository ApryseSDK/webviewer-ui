import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    const bookmarkElements = container.querySelector('.bookmark-outline-text');
    let textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).toBeNull();

    expect(bookmarkElements.className).toContain('bookmark-text-input');
    fireEvent.doubleClick(bookmarkElements);
    textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).not.toBeNull();
  });
});
