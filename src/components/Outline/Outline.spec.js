import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Basic } from './Outline.stories';

const BasicOutline = withProviders(Basic);

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  it('Clicks on the arrow of a parent outline should expand the child outlines', () => {
    const { container } = render(<BasicOutline />);

    let outlineElements = container.querySelectorAll('.outline-drag-container');
    expect(outlineElements.length).toBe(1);

    const arrowButtons = container.querySelectorAll('.outline-treeview-toggle .Button');
    expect(arrowButtons.length).toBe(1);

    fireEvent.click(arrowButtons[0]);

    outlineElements = container.querySelectorAll('.outline-drag-container');
    expect(outlineElements.length).toBe(2);
  });
});
