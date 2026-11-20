import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import useCore from 'hooks/useCore';
import actions from 'src/redux/actions';
import useOnFreeTextEdit from './useOnFreeTextEdit';

jest.mock('core');
jest.mock('hooks/useCore');

describe('useOnFreeTextEdit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no errors', async () => {
    useCore.mockReturnValue({
      core: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getDocument: jest.fn(() => ({})),
        getContentEditManager: () => ({
          isInContentEditMode: () => false,
        }),
        getAnnotationManager: () => ({
          getEditBoxManager: () => ({ getExistingEditor: () => null }),
        }),
        getSelectedAnnotations: () => [],
      },
      documentViewer: {},
    });
    let editor, annotation;
    function DummyComponent() {
      const { editor: resultEditor, annotation: resultAnnotation } = useOnFreeTextEdit();
      editor = resultEditor;
      annotation = resultAnnotation;
      return <div></div>;
    }

    const store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });

    expect(() => {
      render(
        <Provider store={store}>
          <DummyComponent />
        </Provider>
      );
    }).not.toThrow();
    expect(editor).toBeNull();
    expect(annotation).toBeNull();
  });

  it('recovers a selected FreeText editor that was focused before mounting', () => {
    const previousCore = window.Core;
    class FreeTextAnnotation {
      getContentEditAnnotationId() {
        return null;
      }
    }
    const annotation = new FreeTextAnnotation();
    const editor = { hasFocus: () => true };
    const saveEditorInstance = jest.fn();
    window.Core = {
      Annotations: { FreeTextAnnotation },
      Tools: { ToolNames: { ADD_PARAGRAPH: 'ADD_PARAGRAPH' } },
    };
    useCore.mockReturnValue({
      core: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getAnnotationManager: () => ({
          getEditBoxManager: () => ({ getExistingEditor: () => editor }),
        }),
        getSelectedAnnotations: () => [annotation],
      },
      documentViewer: {},
    });

    function DummyComponent() {
      useOnFreeTextEdit(saveEditorInstance);
      return <div></div>;
    }

    const store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    render(
      <Provider store={store}>
        <DummyComponent />
      </Provider>
    );

    expect(saveEditorInstance).toHaveBeenCalledWith([editor, annotation]);
    window.Core = previousCore;
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
        getAnnotationManager: () => ({
          getEditBoxManager: () => ({ getExistingEditor: () => null }),
        }),
        getSelectedAnnotations: () => [],
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
        reducer: rootReducer(),
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

    it('should register and unregister editorFocus event listener on the active document viewer', () => {
      function DummyComponent() {
        useOnFreeTextEdit();
        return <div></div>;
      }

      const { rerender } = render(
        <Provider store={store}>
          <DummyComponent />
        </Provider>
      );

      expect(mockCore1.addEventListener).toHaveBeenCalledWith('editorFocus', expect.any(Function));
      expect(mockCore2.addEventListener).not.toHaveBeenCalled();

      useCore.mockReturnValue({
        core: mockCore2,
        documentViewer: {},
      });
      store.dispatch(actions.setActiveDocumentViewerKey(2));
      rerender(
        <Provider store={store}>
          <DummyComponent />
        </Provider>
      );

      expect(mockCore1.removeEventListener).toHaveBeenCalledWith('editorFocus', expect.any(Function));
      expect(mockCore2.addEventListener).toHaveBeenCalledWith('editorFocus', expect.any(Function));
    });
  });
});