import React from 'react';
import { render, screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import CommentTextarea from './CommentTextarea';
import { createRefHandler } from './CommentTextareaHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import InstanceIdContext from 'src/context/InstanceIdContext';
import mentionsManager from 'helpers/MentionsManager';
import { registerInstance, resetInstances, runWithInstance, setCurrentInstanceId } from 'core/documentViewers';

const mockQuillModules = [];

jest.mock('react-quill-new', () => {
  const React = require('react');
  const MockQuill = { register: jest.fn() };
  const MockReactQuill = React.forwardRef((props, ref) => {
    mockQuillModules.push(props.modules);
    return React.createElement('div', { 'data-testid': 'quill-editor' });
  });
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
describe('CommentTextarea mention suggestions with two instances', () => {
  beforeEach(() => {
    mockQuillModules.length = 0;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetInstances();
  });

  it('should look up users with the callback and user data of its own instance, whichever instance is current', async () => {
    registerInstance(1);
    registerInstance(2);
    const lookup1 = jest.fn().mockResolvedValue([]);
    const lookup2 = jest.fn().mockResolvedValue([]);
    runWithInstance(1, () => mentionsManager.setMentionLookupCallback(lookup1));
    runWithInstance(2, () => mentionsManager.setMentionLookupCallback(lookup2));

    const state = makeViewerState();
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => selector(state));
    const users1 = [{ id: 1, value: 'User of instance 1' }];
    const users2 = [{ id: 2, value: 'User of instance 2' }];
    renderWithProvider(
      <>
        <InstanceIdContext.Provider value={1}><CommentTextarea value="" userData={users1} /></InstanceIdContext.Provider>
        <InstanceIdContext.Provider value={2}><CommentTextarea value="" userData={users2} /></InstanceIdContext.Provider>
      </>,
      state
    );
    const [source1, source2] = [0, 1].map((index) => mockQuillModules[index].mention.source);

    setCurrentInstanceId(2);
    await source1('user', jest.fn());
    setCurrentInstanceId(1);
    await source2('user', jest.fn());

    expect(lookup1).toHaveBeenCalledWith(users1, 'user');
    expect(lookup1).toHaveBeenCalledTimes(1);
    expect(lookup2).toHaveBeenCalledWith(users2, 'user');
    expect(lookup2).toHaveBeenCalledTimes(1);
  });
});
