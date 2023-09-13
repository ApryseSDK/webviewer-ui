import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { File, Folder, Renaming } from './PortfolioItemContent.stories';

const FileItem = withProviders(File);
const FolderItem = withProviders(Folder);
const RenamingItem = withProviders(Renaming);

describe('PortfolioItemContent', () => {
  it('Story should not throw any errors', () => {
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
});
