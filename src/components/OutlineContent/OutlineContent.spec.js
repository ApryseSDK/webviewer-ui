import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Basic, Renaming, ColoredOutline } from './OutlineContent.stories';

const BasicOutline = withProviders(Basic);
const RenamingOutline = withProviders(Renaming);

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  it('Save button in renaming outline is disabled if text is empty or text is the same as current name', () => {
    const { container } = render(<RenamingOutline />);

    const saveButton = container.querySelector('.bookmark-outline-save-button');
    expect(saveButton.disabled).toBe(true);

    const textInput = container.querySelector('.bookmark-outline-input');
    fireEvent.change(textInput, { target: { value: 'new outline' } });
    expect(saveButton.disabled).toBe(false);

    fireEvent.change(textInput, { target: { value: '' } });
    expect(saveButton.disabled).toBe(true);
  });

  it('should set font color if textColor is passed to OutlineContent', () => {
    render(<ColoredOutline />);

    const outline = screen.getByText('A colored outline');
    expect(outline.style.color).toBe('rgb(213, 42, 42)');
  });
});
