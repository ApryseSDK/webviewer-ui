import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Adding, Basic, Renaming, ColoredOutline } from './OutlineContent.stories';

const BasicOutline = withProviders(Basic);
const AddingOutline = withProviders(Adding);
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

  it('should only add an outline once when the add button is clicked rapidly', () => {
    const addNewOutline = jest.fn();
    render(<AddingOutline addNewOutline={addNewOutline} />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(addNewOutline).toHaveBeenCalledTimes(1);
  });

  it('re-enables the add button when addNewOutline rejects', async () => {
    const addNewOutline = jest.fn().mockRejectedValue(new Error('failed to add outline'));
    render(<AddingOutline addNewOutline={addNewOutline} />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => expect(addButton).toBeEnabled());
  });

  it('should set font color if textColor is passed to OutlineContent', () => {
    render(<ColoredOutline />);

    const outline = screen.getByText('A colored outline');
    const computedColor = window.getComputedStyle(outline).color;
    expect(computedColor).toBe('rgb(213, 42, 42)');
  });
});
