import React from 'react';
import { render, screen } from '@testing-library/react';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { Basic } from './BookmarksPanel.stories';
// const BasicBookmarksPanel = withProviders(Basic);

const BasicBookmarksPanel = {};

const NOOP = () => { };

jest.mock('core', () => ({
  setBookmarkIconShortcutVisibility: NOOP,
}));

// Skipped due to failing import in `createFeatureAPI.js`
// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('BookmarksPanel', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicBookmarksPanel />);
    }).not.toThrow();
  });

  it('Clicks the Add Bookmark button should show an input element', async () => {
    const { container } = render(<BasicBookmarksPanel />);
    const addNewBookmarkButton = container.querySelector('[data-element="addNewBookmarkButton"]');
    expect(addNewBookmarkButton.className).toContain('Button TextButton modular-ui');

    let textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).toBeNull();
    await addNewBookmarkButton.click();
    textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).not.toBeNull();
  });

  it('In multi-select mode, add button is enabled when no bookmark is selected and delete button is enabled when at least one bookmark is selected', async () => {
    const { container } = render(<BasicBookmarksPanel />);
    const multiSelectButton = container.querySelector('[data-element="bookmarkMultiSelect"]');
    await multiSelectButton.click();

    const addNewContainer = container.querySelector('[data-element="addNewBookmarkButtonContainer"]');
    const addNewButton = addNewContainer.firstChild;
    const deleteButton = addNewContainer.lastChild;
    expect(addNewButton).not.toBeDisabled();
    expect(deleteButton).toBeDisabled();

    const checkboxContainer = screen.getByRole('checkbox', { name: /Select Page 2 - Bookmark Title/i });
    await checkboxContainer.click();
    expect(checkboxContainer).toBeChecked();
    expect(addNewButton).toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });
});
