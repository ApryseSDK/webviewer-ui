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
      reducer: rootReducer,
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