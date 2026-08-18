import React from 'react';
import { render, screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import CommentTextarea from './CommentTextarea';
import { createRefHandler } from './CommentTextareaHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

jest.mock('react-quill-new', () => {
  const React = require('react');
  const MockQuill = { register: jest.fn() };
  const MockReactQuill = React.forwardRef((props, ref) => React.createElement('div', { 'data-testid': 'quill-editor' }));
  MockReactQuill.displayName = 'MockReactQuill';
  return { __esModule: true, default: MockReactQuill, Quill: MockQuill };
});

jest.mock('quill-mention', () => ({
  Mention: class {},
  MentionBlot: class {},
}));

jest.mock('helpers/quillModules', () => ({
  CustomKeyboard: class {},
  BlurInputModule: class {},
  QuillPasteExtra: class {},
}));

const makeViewerState = (overrides = {}) => ({
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    isOfficeEditorMode: false,
    isSpreadsheetEditorModeEnabled: false,
    activeDocumentViewerKey: 1,
    ...overrides,
  },
  officeEditor: {},
  featureFlags: {},
});

const createMockStore = (state) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: () => () => {},
});

const renderWithProvider = (ui, state) => {
  const store = createMockStore(state);
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

describe('CommentTextarea', () => {
  describe('ref handler', () => {
    it('should set aria label and call external ref handler when editor exists', () => {
      const t = (key) => key;
      const externalRefHandler = jest.fn();
      const handleRef = createRefHandler({
        isReply: true,
        t,
        externalRefHandler,
      });

      const root = {};
      const getEditor = jest.fn(() => ({ root }));
      const element = {
        editor: {},
        getEditor,
      };

      handleRef(element);

      expect(root.ariaLabel).toBe('action.reply');
      expect(externalRefHandler).toHaveBeenCalledWith(element);
    });

    it('should not throw error when element is not defined', () => {
      const t = (key) => key;
      const externalRefHandler = jest.fn();
      const handleRef = createRefHandler({
        isReply: false,
        t,
        externalRefHandler,
      });

      expect(() => handleRef(undefined)).not.toThrow();
      expect(externalRefHandler).toHaveBeenCalledWith(undefined);
    });

    it('should not attempt to access editor when element exists but editor is undefined', () => {
      const t = (key) => key;
      const externalRefHandler = jest.fn();
      const handleRef = createRefHandler({
        isReply: false,
        t,
        externalRefHandler,
      });

      const getEditor = jest.fn();
      const element = {
        editor: undefined,
        getEditor,
      };

      expect(() => handleRef(element)).not.toThrow();
      expect(getEditor).not.toHaveBeenCalled();
      expect(externalRefHandler).toHaveBeenCalledWith(element);
    });
  });
});

describe('CommentTextarea attachment button', () => {
  let useSelectorSpy;

  beforeEach(() => {
    useSelectorSpy = jest.spyOn(reactRedux, 'useSelector');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows attachment button for a reply when not in spreadsheet editor mode', () => {
    const state = makeViewerState();
    useSelectorSpy.mockImplementation((selector) => selector(state));
    const { container } = renderWithProvider(<CommentTextarea isReply={true} value="" />, state);
    expect(screen.getByRole('button', { name: `${getTranslatedText('action.add')} ${getTranslatedText('option.type.fileattachment')}` })).toBeInTheDocument();
  });

  it('hides attachment button for a reply when in spreadsheet editor mode', () => {
    const state = makeViewerState({ isSpreadsheetEditorModeEnabled: true });
    useSelectorSpy.mockImplementation((selector) =>
      selector(state)
    );
    const { container } = renderWithProvider(<CommentTextarea isReply={true} value="" />, state);
    expect(screen.queryByRole('button', { name: `${getTranslatedText('action.add')} ${getTranslatedText('option.type.fileattachment')}` })).not.toBeInTheDocument();
  });

  it('does not show attachment button when isReply is false regardless of spreadsheet mode', () => {
    const state = makeViewerState();
    useSelectorSpy.mockImplementation((selector) => selector(state));
    const { container } = renderWithProvider(<CommentTextarea isReply={false} value="" />, state);
    expect(screen.queryByRole('button', { name: `${getTranslatedText('action.add')} ${getTranslatedText('option.type.fileattachment')}` })).not.toBeInTheDocument();
  });
});