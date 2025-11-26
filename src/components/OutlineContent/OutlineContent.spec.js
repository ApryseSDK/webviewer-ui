import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Basic, Renaming, ColoredOutline } from './OutlineContent.stories';

const BasicOutline = withProviders(Basic);
const RenamingOutline = withProviders(Renaming);

describe('OutlineContent', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  it('Save button in renaming outline is disabled if text is empty or text is the same as current name', () => {
    render(<RenamingOutline />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDisabled();

    const outlineTitleInput = screen.getByRole('textbox', { name: /outline title/i });
    fireEvent.change(outlineTitleInput, { target: { value: 'new outline' } });
    expect(saveButton).toBeEnabled();

    fireEvent.change(outlineTitleInput, { target: { value: '' } });
    expect(saveButton).toBeDisabled();
  });

  it('should set font color if textColor is passed to OutlineContent', () => {
    render(<ColoredOutline />);

    const outline = screen.getByText('A colored outline');
    expect(outline.style.color).toBe('rgb(213, 42, 42)');
  });
});
