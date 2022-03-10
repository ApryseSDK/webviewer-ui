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

    let outlineElements = container.querySelectorAll('.Outline');
    expect(outlineElements.length).toBe(1);

    const arrowElements = container.querySelectorAll('.arrow');
    expect(arrowElements.length).toBe(1);

    fireEvent.click(arrowElements[0]);

    outlineElements = container.querySelectorAll('.Outline');
    expect(outlineElements.length).toBe(2);
  });
});
