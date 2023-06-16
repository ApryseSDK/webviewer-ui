import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Basic } from './BookmarksPanel.stories';

const BasicBookmarksPanel = withProviders(Basic);

const NOOP = () => { };

jest.mock('core', () => ({
  setBookmarkIconShortcutVisibility: NOOP,
}));

describe('BookmarksPanel', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicBookmarksPanel />);
    }).not.toThrow();
  });

  it('Clicks the Add Bookmark button should show an input element', async () => {
    const { container } = render(<BasicBookmarksPanel />);
    const addNewBookmarkButton = container.querySelector('[data-element="addNewBookmarkButton"]');
    expect(addNewBookmarkButton.className).toContain('add-new-button');

    let textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).toBeNull();
    await addNewBookmarkButton.click();
    textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).not.toBeNull();
  });

  it('In multi-select mode, add button is enabled when no bookmark is selected and delete button is enabled when at least one bookmark is selected', async () => {
    const { container } = render(<BasicBookmarksPanel />);
    const multiSelectButton = container.querySelector('[data-element="bookmarkMultiSelect"]');
    expect(multiSelectButton.className).toContain('bookmark-outline-control-button');
    await multiSelectButton.click();

    const addNewContainer = container.querySelector('[data-element="addNewBookmarkButtonContainer"]');
    const addNewButton = addNewContainer.firstChild;
    const deleteButton = addNewContainer.lastChild;
    expect(addNewButton).not.toBeDisabled();
    expect(deleteButton).toBeDisabled();

    const checkboxContainer = container.querySelector('.bookmark-outline-checkbox');
    const checkboxInput = checkboxContainer.querySelector('input[type="checkbox"]');
    await checkboxInput.click();
    expect(checkboxContainer.className).toContain('ui__choice--checked');
    expect(addNewButton).toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });
});
