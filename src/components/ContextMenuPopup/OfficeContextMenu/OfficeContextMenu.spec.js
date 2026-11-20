import React from 'react';
import i18next from 'i18next';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, fireEvent, screen } from '@testing-library/react';
import useCore from 'hooks/useCore';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { EditingStreamType } from 'constants/officeEditor';
import { defaultOfficeEditorPopups } from 'src/redux/officeEditorModularComponents';
import * as device from 'helpers/device';
import OfficeContextMenu from './OfficeContextMenu';

jest.mock('hooks/useCore');

jest.mock('helpers/device', () => ({
  __esModule: true,
  isFirefox: false,
  isMac: false,
}));

jest.mock('actions', () => ({
  __esModule: true,
  default: {
    closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
    showWarningMessage: jest.fn((warning) => ({ type: 'SHOW_WARNING_MESSAGE', payload: warning })),
  },
}));

const CONTEXT_MENU_ITEMS = defaultOfficeEditorPopups[DataElements.CONTEXT_MENU_POPUP];

const STANDARD_ACTION_ITEMS = [
  DataElements.OFFICE_EDITOR_CUT,
  DataElements.OFFICE_EDITOR_COPY,
  DataElements.OFFICE_EDITOR_PASTE,
  DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING,
  DataElements.OFFICE_EDITOR_ADD_COMMENT,
  DataElements.OFFICE_EDITOR_DELETE,
];

const TABLE_ACTION_ITEMS = [
  DataElements.OFFICE_EDITOR_INSERT_ROW_ABOVE,
  DataElements.OFFICE_EDITOR_INSERT_ROW_BELOW,
  DataElements.OFFICE_EDITOR_INSERT_COLUMN_RIGHT,
  DataElements.OFFICE_EDITOR_INSERT_COLUMN_LEFT,
  DataElements.OFFICE_EDITOR_DELETE_ROW,
  DataElements.OFFICE_EDITOR_DELETE_COLUMN,
  DataElements.OFFICE_EDITOR_DELETE_TABLE,
];

const createOfficeEditorMock = (overrides = {}) => ({
  isTextSelected: jest.fn(() => true),
  isImageSelected: jest.fn(() => false),
  pasteText: jest.fn(),
  cutSelectedText: jest.fn(),
  copySelectedText: jest.fn(),
  insertRows: jest.fn(),
  insertColumns: jest.fn(),
  removeRows: jest.fn(),
  removeColumns: jest.fn(),
  removeTable: jest.fn(),
  removeSelection: jest.fn(),
  getCommentManager: jest.fn(() => ({ addCommentThreadAtCurrentRange: jest.fn() })),
  getSpellCheckManager: jest.fn(() => ({ isSpellCheckEnabled: jest.fn(() => false) })),
  getViewerElement: jest.fn(() => ({ focus: jest.fn() })),
  ...overrides,
});

const createState = ({ isCursorInTable = false, activeStream = EditingStreamType.BODY } = {}) => ({
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    activeDocumentViewerKey: 1,
    isMultiViewerMode: false,
    modularPopups: {
      [DataElements.CONTEXT_MENU_POPUP]: CONTEXT_MENU_ITEMS,
    },
  },
  officeEditor: {
    cursorProperties: {
      locationProperties: { inTable: isCursorInTable },
    },
    stream: activeStream,
  },
});

const renderWithState = (state, props = {}) => {
  // The Firefox paste warning carries onConfirm/onCancel callbacks, which the serializable check would log as errors
  const store = configureStore({
    reducer: () => state,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });
  const { container } = render(
    <Provider store={store}>
      <OfficeContextMenu {...props} />
    </Provider>,
  );
  return { container, store };
};

const getItem = (container, dataElement) => container.querySelector(`[data-element="${dataElement}"]`);

describe('OfficeContextMenu', () => {
  let officeEditor;

  const setOfficeEditor = (overrides = {}) => {
    officeEditor = createOfficeEditorMock(overrides);
    useCore.mockReturnValue({ core: { getOfficeEditor: () => officeEditor } });
  };

  beforeEach(() => {
    setOfficeEditor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the standard action items and hide table-only items when the cursor is not in a table', () => {
    const { container } = renderWithState(createState());

    STANDARD_ACTION_ITEMS.forEach((dataElement) => {
      expect(getItem(container, dataElement)).not.toBeNull();
    });
    TABLE_ACTION_ITEMS.forEach((dataElement) => {
      expect(getItem(container, dataElement)).toBeNull();
    });
  });

  it('should render table action items and hide Delete when the cursor is in a table', () => {
    const { container } = renderWithState(createState({ isCursorInTable: true }));

    TABLE_ACTION_ITEMS.forEach((dataElement) => {
      expect(getItem(container, dataElement)).not.toBeNull();
    });

    expect(getItem(container, DataElements.OFFICE_EDITOR_DELETE)).toBeNull();
  });

  it('should disable Cut and Copy when no text is selected', () => {
    setOfficeEditor({ isTextSelected: jest.fn(() => false) });

    const { container } = renderWithState(createState());

    expect(getItem(container, DataElements.OFFICE_EDITOR_CUT)).toBeDisabled();
    expect(getItem(container, DataElements.OFFICE_EDITOR_COPY)).toBeDisabled();
  });

  it.each([
    ['cutSelectedText', DataElements.OFFICE_EDITOR_CUT],
    ['copySelectedText', DataElements.OFFICE_EDITOR_COPY],
    ['removeSelection', DataElements.OFFICE_EDITOR_DELETE],
  ])('should invoke officeEditor.%s when its menu item is clicked', (method, dataElement) => {
    const { container } = renderWithState(createState());
    fireEvent.click(getItem(container, dataElement));
    expect(officeEditor[method]).toHaveBeenCalledTimes(1);
  });

  it.each([
    [DataElements.OFFICE_EDITOR_PASTE, true],
    [DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING, false],
  ])('should call officeEditor.pasteText(%s) when the matching paste item is clicked', (dataElement, withFormatting) => {
    const { container } = renderWithState(createState());
    fireEvent.click(getItem(container, dataElement));
    expect(officeEditor.pasteText).toHaveBeenCalledWith(withFormatting);
  });

  describe('Firefox paste fallback', () => {
    // Firefox blocks programmatic clipboard paste, so the context menu shows a warning
    // instructing the user to use the keyboard shortcut instead of calling pasteText.
    let firefoxProperty;

    beforeEach(() => {
      firefoxProperty = jest.replaceProperty(device, 'isFirefox', true);
    });

    afterEach(() => {
      firefoxProperty.restore();
    });

    it('should not call officeEditor.pasteText and should warn with the paste shortcut when Paste is clicked', () => {
      const { container } = renderWithState(createState());

      fireEvent.click(getItem(container, DataElements.OFFICE_EDITOR_PASTE));

      expect(officeEditor.pasteText).not.toHaveBeenCalled();
      expect(actions.showWarningMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Ctrl + V'),
        }),
      );
      expect(actions.showWarningMessage.mock.calls[0][0].message).not.toContain('Shift');
    });

    it('should not call officeEditor.pasteText and should warn with the paste-without-formatting shortcut when Paste Without Formatting is clicked', () => {
      const { container } = renderWithState(createState());

      fireEvent.click(getItem(container, DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING));

      expect(officeEditor.pasteText).not.toHaveBeenCalled();
      expect(actions.showWarningMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Ctrl + Shift + V'),
        }),
      );
    });
  });

  it('should enable Add Comment in the body stream and call addCommentThreadAtCurrentRange when clicked', () => {
    const addCommentThreadAtCurrentRange = jest.fn();
    setOfficeEditor({ getCommentManager: jest.fn(() => ({ addCommentThreadAtCurrentRange })) });

    const { container } = renderWithState(createState({ activeStream: EditingStreamType.BODY }));
    const addCommentButton = getItem(container, DataElements.OFFICE_EDITOR_ADD_COMMENT);

    expect(addCommentButton).not.toBeDisabled();

    fireEvent.click(addCommentButton);

    expect(addCommentThreadAtCurrentRange).toHaveBeenCalledWith('');
  });

  it('should disable Add Comment outside of the body stream', () => {
    const { container } = renderWithState(createState({ activeStream: EditingStreamType.HEADER }));
    expect(getItem(container, DataElements.OFFICE_EDITOR_ADD_COMMENT)).toBeDisabled();
  });

  it.each([
    ['text is selected', true, false, false],
    ['an image is selected', false, true, false],
    ['text and an image are selected', true, true, false],
    ['nothing is selected', false, false, true],
  ])('should set disabled status of Delete button correctly when %s', (description, isTextSelected, isImageSelected, shouldBeDisabled) => {
    setOfficeEditor({
      isTextSelected: jest.fn(() => isTextSelected),
      isImageSelected: jest.fn(() => isImageSelected),
    });

    const { container } = renderWithState(createState());
    const deleteItem = getItem(container, DataElements.OFFICE_EDITOR_DELETE);
    if (shouldBeDisabled) {
      expect(deleteItem).toBeDisabled();
    } else {
      expect(deleteItem).not.toBeDisabled();
    }
  });

  describe('table actions', () => {
    it.each([
      ['insertRows', DataElements.OFFICE_EDITOR_INSERT_ROW_ABOVE, [true]],
      ['insertRows', DataElements.OFFICE_EDITOR_INSERT_ROW_BELOW, [false]],
      ['insertColumns', DataElements.OFFICE_EDITOR_INSERT_COLUMN_RIGHT, [true]],
      ['insertColumns', DataElements.OFFICE_EDITOR_INSERT_COLUMN_LEFT, [false]],
      ['removeRows', DataElements.OFFICE_EDITOR_DELETE_ROW, []],
      ['removeColumns', DataElements.OFFICE_EDITOR_DELETE_COLUMN, []],
      ['removeTable', DataElements.OFFICE_EDITOR_DELETE_TABLE, []],
    ])('should call officeEditor.%s with the expected arguments when %s is clicked', (method, dataElement, args) => {
      const { container } = renderWithState(createState({ isCursorInTable: true }));

      fireEvent.click(getItem(container, dataElement));

      expect(officeEditor[method]).toHaveBeenCalledWith(...args);
    });
  });

  describe('spell check suggestions', () => {
    const createSpellingError = (id) => ({ spellingErrorId: id, misspelledWord: `misspelling${id}` });

    beforeEach(() => {
      setOfficeEditor({ getSpellCheckManager: jest.fn(() => ({ isSpellCheckEnabled: jest.fn(() => true) })) });
    });

    it('should render the suggestions section in the context menu for the misspelled word under the cursor', async () => {
      const { container } = renderWithState(createState(), createSpellingError(1));

      expect(await screen.findByText(i18next.t('officeEditor.spellCheck.noSuggestions'))).toBeInTheDocument();
      expect(getItem(container, DataElements.OFFICE_EDITOR_SPELL_CHECK_SUGGESTIONS)).not.toBeNull();
    });
  });
});
