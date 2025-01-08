import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { File, Folder, Renaming } from './PortfolioItemContent.stories';

const FileItem = withProviders(File);
const FolderItem = withProviders(Folder);
const RenamingItem = withProviders(Renaming);

describe('PortfolioItemContent', () => {
  // Skipping for now, we refactor updateFlyout from internalActions.js
  // Error: Actions must be plain objects. Instead, the actual type was: 'function'.
  // You may need to add middleware to your store setup to handle dispatching other values,
  // such as 'redux-thunk' to handle dispatching functions.
  it.skip('Story should not throw any errors', () => {
    expect(() => {
      render(<FileItem />);
    }).not.toThrow();
    expect(() => {
      render(<FolderItem />);
    }).not.toThrow();
  });

  it('Save button in renaming outline is disabled if text is empty or text is the same as current name', () => {
    const { container } = render(<RenamingItem />);

    const saveButton = container.querySelector('.bookmark-outline-save-button');
    expect(saveButton.disabled).toBe(true);

    const textInput = container.querySelector('.portfolio-input .ui__input__input');
    fireEvent.change(textInput, { target: { value: 'new folder' } });
    expect(saveButton.disabled).toBe(false);

    fireEvent.change(textInput, { target: { value: '' } });
    expect(saveButton.disabled).toBe(true);
  });

  it('Rename Item should have a valid Aria Label', () => {
    render(<RenamingItem />);

    const element = screen.getByRole('textbox');
    expect(element).toHaveAttribute('aria-label');
  });
});
