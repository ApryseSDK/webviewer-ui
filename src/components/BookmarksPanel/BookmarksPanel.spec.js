import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BookmarksPanel from './BookmarksPanel';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import actions from 'src/redux/actions';
import rootReducer from 'src/redux/reducers/rootReducer';
import userEvent from '@testing-library/user-event';
import core from 'core';
import DataElements from 'constants/dataElement';
import { ConditionalFlyout } from 'jest/testUtils';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { Basic } from './BookmarksPanel.stories';
// const BasicBookmarksPanel = withProviders(Basic);

const BasicBookmarksPanel = {};

const NOOP = () => { };

jest.mock('core', () => ({
  setBookmarkIconShortcutVisibility: jest.fn(),
  getDocumentViewer: jest.fn(),
  getDocumentViewers: jest.fn(() => []),
  getUserBookmarks: NOOP,
  addUserBookmark: jest.fn(),
  setUserBookmarks: jest.fn(),
  removeUserBookmark: jest.fn(),
  removeEventListener: NOOP,
  setCurrentPage: jest.fn(),
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

describe('BookmarksPanel in MultiViewer mode', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    const documentViewer = {
      setBookmarkIconShortcutVisibility: jest.fn(),
    };
    core.getDocumentViewers.mockReturnValue([documentViewer, documentViewer]);
    const bookmarksForViewer1 = {
      '0': 'Lion',
    };
    const bookmarksForViewer2 = {
      '0': 'Goat',
    };
    store.dispatch(actions.setBookmarks(bookmarksForViewer1, 1));
    store.dispatch(actions.setBookmarks(bookmarksForViewer2, 2));
    store.dispatch(actions.setIsMultiViewerMode(true));
    store.dispatch(actions.setActiveDocumentViewerKey(1));
    store.dispatch(actions.setCurrentPage(2, 1));
    store.dispatch(actions.setCurrentPage(2, 2));
    store.dispatch({
      type: 'SET_PAGE_LABELS',
      payload: {
        pageLabels: ['1', '2'],
        documentViewerKey: 1,
      },
    });
    store.dispatch({
      type: 'SET_PAGE_LABELS',
      payload: {
        pageLabels: ['1', '2'],
        documentViewerKey: 2,
      },
    });
  });

  afterEach(() => {
    store = null;
    jest.resetAllMocks();
  });

  it('should render the bookmarks of the active document viewer', async () => {
    const addNewBookmarkSpy = jest.spyOn(core, 'addUserBookmark').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <BookmarksPanel />
      </Provider>
    );

    expect(await screen.findByText('Lion')).toBeInTheDocument();
    expect(screen.queryByText('Goat')).not.toBeInTheDocument();

    let addBookmarksButton = await screen.findByRole('button', { name: /Add Bookmark/i });
    userEvent.click(addBookmarksButton);

    let addSaveButton = await screen.findByText('Add', { exact: true });
    expect(addSaveButton).toBeTruthy();
    userEvent.click(addSaveButton);
    expect(addNewBookmarkSpy).toHaveBeenNthCalledWith(1, 1, expect.any(String), 1);

    store.dispatch(actions.setActiveDocumentViewerKey(2));

    addBookmarksButton = await screen.findByRole('button', { name: /Add Bookmark/i });
    userEvent.click(addBookmarksButton);
    addSaveButton = await screen.findByText('Add', { exact: true });
    expect(addSaveButton).toBeTruthy();
    userEvent.click(addSaveButton);

    expect(addNewBookmarkSpy).toHaveBeenNthCalledWith(2, 1, expect.any(String), 2);

    expect(await screen.findByText('Goat')).toBeInTheDocument();
    expect(screen.queryByText('Lion')).not.toBeInTheDocument();
  });

  it('should rename the bookmarks of the active document viewer', async () => {
    const setBookmarkNameSpy = jest.spyOn(core, 'setUserBookmarks').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <div>
          <BookmarksPanel />
          <ConditionalFlyout store={store} />
        </div>
      </Provider>
    );

    let moreOptionsButton = await screen.findByRole('button', { name: /More options Page 1/i });
    userEvent.click(moreOptionsButton);
    store.dispatch(actions.setActiveFlyout(`${DataElements.BOOKMARK_FLYOUT}-0`));

    let renameButton = await screen.findByRole('button', { name: /Rename/i });
    userEvent.click(renameButton);

    let newBookmarkTitleTextbox = await screen.findByRole('textbox', { name: /Name/i });
    userEvent.type(newBookmarkTitleTextbox, 'Panther');
    fireEvent.keyDown(newBookmarkTitleTextbox, { key: 'Enter', code: 'Enter' });
    expect(setBookmarkNameSpy).toHaveBeenNthCalledWith(1, expect.anything(), 1);

    store.dispatch(actions.setActiveDocumentViewerKey(2));

    moreOptionsButton = await screen.findByRole('button', { name: /More options Page 1/i });
    userEvent.click(moreOptionsButton);
    store.dispatch(actions.setActiveFlyout(`${DataElements.BOOKMARK_FLYOUT}-0`));

    renameButton = await screen.findByRole('button', { name: /Rename/i });
    userEvent.click(renameButton);

    newBookmarkTitleTextbox = await screen.findByRole('textbox', { name: /Name/i });
    userEvent.type(newBookmarkTitleTextbox, 'Alpaca');
    fireEvent.keyDown(newBookmarkTitleTextbox, { key: 'Enter', code: 'Enter' });
    expect(setBookmarkNameSpy).toHaveBeenNthCalledWith(2, expect.anything(), 2);
  });

  it('should delete the bookmarks of the active document viewer', async () => {
    const showWarningSpy = jest.spyOn(actions, 'showWarningMessage');
    const deleteBookmarkSpy = jest.spyOn(core, 'removeUserBookmark').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <div>
          <BookmarksPanel />
          <ConditionalFlyout store={store} />
        </div>
      </Provider>
    );

    let moreOptionsButton = await screen.findByRole('button', { name: /More options Page 1/i });
    userEvent.click(moreOptionsButton);
    store.dispatch(actions.setActiveFlyout(`${DataElements.BOOKMARK_FLYOUT}-0`));

    let deleteButton = await screen.findByRole('button', { name: /Delete/i });
    userEvent.click(deleteButton);

    let confirmationWarning = showWarningSpy.mock.calls[0][0];
    let { onConfirm } = confirmationWarning;
    onConfirm();
    expect(deleteBookmarkSpy).toHaveBeenNthCalledWith(1, expect.anything(), 1);

    store.dispatch(actions.setActiveDocumentViewerKey(2));

    moreOptionsButton = await screen.findByRole('button', { name: /More options Page 1/i });
    userEvent.click(moreOptionsButton);
    store.dispatch(actions.setActiveFlyout(`${DataElements.BOOKMARK_FLYOUT}-0`));

    deleteButton = await screen.findByRole('button', { name: /Delete/i });
    userEvent.click(deleteButton);

    confirmationWarning = showWarningSpy.mock.calls[1][0];
    ({ onConfirm } = confirmationWarning);
    onConfirm();
    expect(deleteBookmarkSpy).toHaveBeenNthCalledWith(2, expect.anything(), 2);
  });

  it('should toggle bookmark icon shortcut visibility in all viewers', async () => {
    const setBookmarkIconShortcutVisibilityViewer1 = jest.fn();
    const setBookmarkIconShortcutVisibilityViewer2 = jest.fn();
    core.getDocumentViewers.mockReturnValue([
      { setBookmarkIconShortcutVisibility: setBookmarkIconShortcutVisibilityViewer1 },
      { setBookmarkIconShortcutVisibility: setBookmarkIconShortcutVisibilityViewer2 },
    ]);

    render(
      <Provider store={store}>
        <BookmarksPanel />
      </Provider>
    );

    expect(setBookmarkIconShortcutVisibilityViewer1).toHaveBeenCalledWith(false);
    expect(setBookmarkIconShortcutVisibilityViewer2).toHaveBeenCalledWith(false);

    const toggleBookmarkIconShortcutButton = await screen.findByText(/View Bookmark on Page/i);
    userEvent.click(toggleBookmarkIconShortcutButton);

    expect(setBookmarkIconShortcutVisibilityViewer1).toHaveBeenCalledWith(true);
    expect(setBookmarkIconShortcutVisibilityViewer2).toHaveBeenCalledWith(true);
  });

  it('should navigate to bookmark destination in the active document viewer', async () => {
    jest.useFakeTimers();
    const setCurrentPageSpy = jest.spyOn(core, 'setCurrentPage').mockImplementation(() => {});
    store.dispatch(actions.setCurrentPage(7, 1));
    store.dispatch(actions.setCurrentPage(7, 2));
    render(
      <Provider store={store}>
        <div>
          <BookmarksPanel />
          <ConditionalFlyout store={store} />
        </div>
      </Provider>
    );

    const lionBookmark = await screen.findByRole('button', { name: 'Page 1' });
    userEvent.click(lionBookmark);

    // Advance timers by 350ms to account for the 300ms delay after clicking the bookmark in Bookmark.js
    jest.advanceTimersByTime(350);
    await expect(setCurrentPageSpy).toHaveBeenNthCalledWith(1, 1, 1);

    store.dispatch(actions.setActiveDocumentViewerKey(2));

    const goatBookmark = await screen.findByRole('button', { name: 'Page 1' });
    userEvent.click(goatBookmark);
    jest.advanceTimersByTime(350);
    await expect(setCurrentPageSpy).toHaveBeenNthCalledWith(2, 1, 2);
    jest.useRealTimers();
  });
});
