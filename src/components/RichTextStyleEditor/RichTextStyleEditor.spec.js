import React from 'react';
import RichTextStyleEditor from './RichTextStyleEditor';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import useCore from 'hooks/useCore';
import actions from 'src/redux/actions';

jest.mock('core');
jest.mock('hooks/useCore');

describe('RichTextStyleEditor', () => {
  let store;
  const originalWindowCore = window.Core;
  const defaultProps = {
    annotation: {},
    editor: {
      getSelection: () => ({}),
      getFormat: () => ({}),
    },
    style: {},
  };

  beforeEach(() => {
    useCore.mockReturnValue({
      core: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getDocument: () => {},
        getContentEditManager: () => ({
          isInContentEditMode: () => false,
        }),
      },
      documentViewer: {},
    });
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
  });

  afterEach(() => {
    window.Core = originalWindowCore;
    jest.clearAllMocks();
  });

  it('should render with no errors', () => {
    render(
      <Provider store={store}>
        <RichTextStyleEditor {...defaultProps} />
      </Provider>
    );
  });

  it('should trigger format update when user clicks color button', () => {
    // eslint-disable-next-line custom/no-hex-colors
    const defaultColor = '#000000';
    const editor = {
      getSelection: () => ({ index: 3, length: 5 }),
      getFormat: () => ({ color: defaultColor }),
      format: jest.fn(),
    };

    // Mock Core Annotations class to help create a nock Color object for the prop annotation
    window.Core = {
      Annotations: {
        Color: class Color {
          constructor(value) {
            this.value = value;
          }
          toHexString() {
            return this.value;
          }
        },
      },
      Tools: { ToolNames: { EDIT: 'EDIT' } },
    };

    const props = {
      ...defaultProps,
      editor,
      isRichTextEditMode: true,
      // eslint-disable-next-line custom/no-hex-colors
      annotation: { TextColor: new window.Core.Annotations.Color(defaultColor), getRichTextStyle: () => ({ 0: {} }), getCalculatedFontSize: () => '12pt' },
      // eslint-disable-next-line custom/no-hex-colors
      style: { TextColor: defaultColor, RichTextStyle: { 0: {} } },
    };

    const { getByRole } = render(
      <Provider store={store}>
        <RichTextStyleEditor {...props} />
      </Provider>
    );

    // eslint-disable-next-line custom/no-hex-colors
    const newColor = '#cdcdcd';
    const colorButton = getByRole('button', { name: `Text Style Color ${newColor.toUpperCase()}` });
    colorButton.click();
    expect(editor.format).toHaveBeenCalledWith('color', newColor);
  });

  describe('MultiViewer mode', () => {
    let store;
    let mockCore1;
    let mockCore2;

    const createMockCore = () => {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getDocument: () => {},
        getContentEditManager: () => ({
          isInContentEditMode: () => false,
        }),
      };
    };

    beforeEach(() => {
      mockCore1 = createMockCore();
      mockCore2 = createMockCore();
      useCore.mockReturnValue({
        core: mockCore1,
        documentViewer: {},
      });
      store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
      });
      store.dispatch(actions.setIsMultiViewerMode(true));
      store.dispatch(actions.setActiveDocumentViewerKey(1));
    });

    afterEach(() => {
      jest.clearAllMocks();
      store = null;
      mockCore1 = null;
      mockCore2 = null;
    });

    it('should register and unregister editor event listeners for the active document viewer', () => {
      const { rerender } = render(
        <Provider store={store}>
          <RichTextStyleEditor {...defaultProps} />
        </Provider>
      );

      const eventNames = ['editorFocus', 'editorSelectionChanged', 'editorTextChanged', 'editorBlur'];
      const eventNameToHandlerMap = {};
      for (const eventName of eventNames) {
        expect(mockCore1.addEventListener).toHaveBeenCalledWith(eventName, expect.any(Function));
        eventNameToHandlerMap[eventName] = mockCore1.addEventListener.mock.calls.find(
          (call) => call[0] === eventName
        )[1];
        expect(mockCore2.addEventListener).not.toHaveBeenCalledWith(eventName, expect.any(Function));
      }

      useCore.mockReturnValue({
        core: mockCore2,
        documentViewer: {},
      });
      store.dispatch(actions.setActiveDocumentViewerKey(2));
      rerender(
        <Provider store={store}>
          <RichTextStyleEditor {...defaultProps} activeTool="AnnotationCreateFreeText2" />
        </Provider>
      );

      for (const eventName of eventNames) {
        expect(mockCore1.removeEventListener).toHaveBeenCalledWith(eventName, eventNameToHandlerMap[eventName]);
        expect(mockCore2.addEventListener).toHaveBeenCalledWith(eventName, expect.any(Function));
      }
    });
  });
});