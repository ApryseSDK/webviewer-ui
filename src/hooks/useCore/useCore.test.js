import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import useCore from './useCore';
import core from 'core';

// Mock the core module
jest.mock('core', () => ({
  getSelectedAnnotations: jest.fn(),
  getToolMode: jest.fn(),
  getAnnotationManager: jest.fn(),
  canModify: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getDocument: jest.fn(),
  getCurrentPage: jest.fn(),
  setCurrentPage: jest.fn(),
  getDisplayAuthor: jest.fn(),
  getOutlines: jest.fn(),
  getSelectedText: jest.fn(),
  getAnnotationsList: jest.fn(),
  getAnnotationsLoadedPromise: jest.fn(),
  getPrintablePDF: jest.fn(),
  getScrollViewElement: jest.fn(),
  getAnnotationById: jest.fn(),
  isFullPDFEnabled: jest.fn(),
  isAnnotationSelected: jest.fn(),
  deselectAnnotation: jest.fn(),
  deselectAnnotations: jest.fn(),
  deselectAllAnnotations: jest.fn(),
  jumpToAnnotation: jest.fn(),
  selectAnnotation: jest.fn(),
  selectAnnotations: jest.fn(),
  addAnnotations: jest.fn(),
  deleteAnnotations: jest.fn(),
  getGroupAnnotations: jest.fn(),
  getTool: jest.fn(),
  setToolMode: jest.fn(),
  getOfficeEditor: jest.fn(),
  getDocumentViewer: jest.fn(),
  getZoom: jest.fn(),
  fitToWidth: jest.fn(),
  fitToPage: jest.fn(),
  fitToHeight: jest.fn(),
  getCurrentUser: jest.fn(),
  getUserBookmarks: jest.fn(),
  setUserBookmarks: jest.fn(),
  addUserBookmark: jest.fn(),
  removeUserBookmark: jest.fn(),
  getSemanticDiffAnnotations: jest.fn(),
}));

jest.mock('selectors', () => ({
  getActiveDocumentViewerKey: jest.fn((state) => {
    return state.viewer.isMultiViewerMode && state.viewer.activeDocumentViewerKey
      ? state.viewer.activeDocumentViewerKey
      : 1;
  }),
}));

describe('useCore', () => {
  const createMockStore = (activeDocumentViewerKey = 1, isMultiViewerMode = true) => {
    const initialState = {
      viewer: {
        activeDocumentViewerKey,
        isMultiViewerMode,
      },
    };

    function rootReducer(state = initialState) {
      return state;
    }

    return createStore(rootReducer);
  };

  const renderHookWithStore = (overrideKey, store) => {
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    return renderHook(() => useCore(overrideKey), { wrapper });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Key Selection', () => {
    it('should use documentViewerKey from Redux selector when no override is provided', () => {
      const store = createMockStore(2);
      const { result } = renderHookWithStore(undefined, store);

      result.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(2);
    });

    it('should use overrideDocumentViewerKey when provided', () => {
      const store = createMockStore(2);
      const { result } = renderHookWithStore(3, store);

      result.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(3);
    });

    it('should default to key 1 when documentViewerKey is null', () => {
      const store = createMockStore(null);
      const { result } = renderHookWithStore(undefined, store);

      result.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(1);
    });

    it('should default to key 1 when documentViewerKey is undefined', () => {
      const store = createMockStore(undefined);
      const { result } = renderHookWithStore(undefined, store);

      result.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(1);
    });
  });

  describe('Core Method Wrapping - Simple Methods', () => {
    let store;
    let result;

    beforeEach(() => {
      store = createMockStore(2);
      const hook = renderHookWithStore(undefined, store);
      result = hook.result;
    });

    it('should wrap getSelectedAnnotations with key', () => {
      result.current.core.getSelectedAnnotations();
      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(2);
    });

    it('should wrap getToolMode with key', () => {
      result.current.core.getToolMode();
      expect(core.getToolMode).toHaveBeenCalledWith(2);
    });

    it('should wrap getAnnotationManager with key', () => {
      result.current.core.getAnnotationManager();
      expect(core.getAnnotationManager).toHaveBeenCalledWith(2);
    });

    it('should wrap getDocument with key', () => {
      result.current.core.getDocument();
      expect(core.getDocument).toHaveBeenCalledWith(2);
    });

    it('should wrap getCurrentPage with key', () => {
      result.current.core.getCurrentPage();
      expect(core.getCurrentPage).toHaveBeenCalledWith(2);
    });

    it('should wrap getSelectedText with key', () => {
      result.current.core.getSelectedText();
      expect(core.getSelectedText).toHaveBeenCalledWith(2);
    });

    it('should wrap getAnnotationsList with key', () => {
      result.current.core.getAnnotationsList();
      expect(core.getAnnotationsList).toHaveBeenCalledWith(2);
    });

    it('should wrap getAnnotationsLoadedPromise with key', () => {
      result.current.core.getAnnotationsLoadedPromise();
      expect(core.getAnnotationsLoadedPromise).toHaveBeenCalledWith(2);
    });

    it('should wrap getPrintablePDF with key', () => {
      result.current.core.getPrintablePDF();
      expect(core.getPrintablePDF).toHaveBeenCalledWith(2);
    });

    it('should wrap getScrollViewElement with key', () => {
      result.current.core.getScrollViewElement();
      expect(core.getScrollViewElement).toHaveBeenCalledWith(2);
    });

    it('should wrap isFullPDFEnabled with key', () => {
      result.current.core.isFullPDFEnabled();
      expect(core.isFullPDFEnabled).toHaveBeenCalledWith(2);
    });

    it('should wrap deselectAllAnnotations without key', () => {
      result.current.core.deselectAllAnnotations();
      expect(core.deselectAllAnnotations).toHaveBeenCalledWith();
    });

    it('should wrap setToolMode without key', () => {
      result.current.core.setToolMode('AnnotationEdit');
      expect(core.setToolMode).toHaveBeenCalledWith('AnnotationEdit');
    });

    it('should wrap getOfficeEditor with key', () => {
      result.current.core.getOfficeEditor();
      expect(core.getOfficeEditor).toHaveBeenCalledWith(2);
    });

    it('should wrap getDocumentViewer with key', () => {
      result.current.core.getDocumentViewer();
      expect(core.getDocumentViewer).toHaveBeenCalledWith(2);
    });

    it('should wrap getZoom with key', () => {
      result.current.core.getZoom();
      expect(core.getZoom).toHaveBeenCalledWith(2);
    });

    it('should wrap fitToWidth with key', () => {
      result.current.core.fitToWidth();
      expect(core.fitToWidth).toHaveBeenCalledWith(2);
    });

    it('should wrap fitToPage with key', () => {
      result.current.core.fitToPage();
      expect(core.fitToPage).toHaveBeenCalledWith(2);
    });

    it('should wrap fitToHeight with key', () => {
      result.current.core.fitToHeight();
      expect(core.fitToHeight).toHaveBeenCalledWith(2);
    });

    it('should wrap getCurrentUser with key', () => {
      result.current.core.getCurrentUser();
      expect(core.getCurrentUser).toHaveBeenCalledWith(2);
    });

    it('should wrap getUserBookmarks with key', () => {
      result.current.core.getUserBookmarks();
      expect(core.getUserBookmarks).toHaveBeenCalledWith(2);
    });

    it('should wrap getSemanticDiffAnnotations with key', () => {
      result.current.core.getSemanticDiffAnnotations();
      expect(core.getSemanticDiffAnnotations).toHaveBeenCalledWith(2);
    });
  });

  describe('Core Method Wrapping - Methods with Parameters', () => {
    let store;
    let result;

    beforeEach(() => {
      store = createMockStore(2);
      const hook = renderHookWithStore(undefined, store);
      result = hook.result;
    });

    it('should wrap canModify with annotation parameter and key', () => {
      const mockAnnotation = { id: 'test-123' };
      result.current.core.canModify(mockAnnotation);
      expect(core.canModify).toHaveBeenCalledWith(mockAnnotation, 2);
    });

    it('should wrap addEventListener with event, handler, options, and key', () => {
      const handler = jest.fn();
      const options = { passive: true };
      result.current.core.addEventListener('annotationsLoaded', handler, options);
      expect(core.addEventListener).toHaveBeenCalledWith('annotationsLoaded', handler, options, 2);
    });

    it('should wrap removeEventListener with event, handler, and key', () => {
      const handler = jest.fn();
      result.current.core.removeEventListener('annotationsLoaded', handler);
      expect(core.removeEventListener).toHaveBeenCalledWith('annotationsLoaded', handler, 2);
    });

    it('should wrap setCurrentPage with pageNum and key', () => {
      result.current.core.setCurrentPage(5);
      expect(core.setCurrentPage).toHaveBeenCalledWith(5, 2);
    });

    it('should wrap getDisplayAuthor with author and key', () => {
      result.current.core.getDisplayAuthor('john.doe');
      expect(core.getDisplayAuthor).toHaveBeenCalledWith('john.doe', 2);
    });

    it('should wrap getOutlines with callback and key', () => {
      const callback = jest.fn();
      result.current.core.getOutlines(callback);
      expect(core.getOutlines).toHaveBeenCalledWith(callback, 2);
    });

    it('should wrap getAnnotationById with id and key', () => {
      result.current.core.getAnnotationById('annotation-456');
      expect(core.getAnnotationById).toHaveBeenCalledWith('annotation-456', 2);
    });

    it('should wrap isAnnotationSelected with annotation and key', () => {
      const mockAnnotation = { id: 'test-789' };
      result.current.core.isAnnotationSelected(mockAnnotation);
      expect(core.isAnnotationSelected).toHaveBeenCalledWith(mockAnnotation, 2);
    });

    it('should wrap deselectAnnotation with annotation and key', () => {
      const mockAnnotation = { id: 'test-101' };
      result.current.core.deselectAnnotation(mockAnnotation);
      expect(core.deselectAnnotation).toHaveBeenCalledWith(mockAnnotation, 2);
    });

    it('should wrap deselectAnnotations with annotations array and key', () => {
      const mockAnnotations = [{ id: 'test-102' }, { id: 'test-103' }];
      result.current.core.deselectAnnotations(mockAnnotations);
      expect(core.deselectAnnotations).toHaveBeenCalledWith(mockAnnotations, 2);
    });

    it('should wrap jumpToAnnotation with annotation and key', () => {
      const mockAnnotation = { id: 'test-104' };
      result.current.core.jumpToAnnotation(mockAnnotation);
      expect(core.jumpToAnnotation).toHaveBeenCalledWith(mockAnnotation, 2);
    });

    it('should wrap selectAnnotation with annotation and key', () => {
      const mockAnnotation = { id: 'test-105' };
      result.current.core.selectAnnotation(mockAnnotation);
      expect(core.selectAnnotation).toHaveBeenCalledWith(mockAnnotation, 2);
    });

    it('should wrap selectAnnotations with annotations array and key', () => {
      const mockAnnotations = [{ id: 'test-106' }, { id: 'test-107' }];
      result.current.core.selectAnnotations(mockAnnotations);
      expect(core.selectAnnotations).toHaveBeenCalledWith(mockAnnotations, 2);
    });

    it('should wrap addAnnotations with annotations array and key', () => {
      const mockAnnotations = [{ id: 'test-108' }];
      result.current.core.addAnnotations(mockAnnotations);
      expect(core.addAnnotations).toHaveBeenCalledWith(mockAnnotations, 2);
    });

    it('should wrap deleteAnnotations with annotations, options, and key', () => {
      const mockAnnotations = [{ id: 'test-109' }];
      const options = { force: true };
      result.current.core.deleteAnnotations(mockAnnotations, options);
      expect(core.deleteAnnotations).toHaveBeenCalledWith(mockAnnotations, options, 2);
    });

    it('should wrap getGroupAnnotations with annotation and key', () => {
      const mockAnnotation = { id: 'test-110' };
      result.current.core.getGroupAnnotations(mockAnnotation);
      expect(core.getGroupAnnotations).toHaveBeenCalledWith(mockAnnotation, 2);
    });

    it('should wrap getTool with toolName and key', () => {
      result.current.core.getTool('AnnotationEdit');
      expect(core.getTool).toHaveBeenCalledWith('AnnotationEdit', 2);
    });

    it('should wrap setUserBookmarks with bookmarks and key', () => {
      const bookmarks = [{ pageNumber: 1 }];
      result.current.core.setUserBookmarks(bookmarks);
      expect(core.setUserBookmarks).toHaveBeenCalledWith(bookmarks, 2);
    });

    it('should wrap addUserBookmark with pageNumber, text, and key', () => {
      result.current.core.addUserBookmark(3, 'My Bookmark');
      expect(core.addUserBookmark).toHaveBeenCalledWith(3, 'My Bookmark', 2);
    });

    it('should wrap removeUserBookmark with pageNumber and key', () => {
      result.current.core.removeUserBookmark(5);
      expect(core.removeUserBookmark).toHaveBeenCalledWith(5, 2);
    });
  });

  describe('Return Value Structure', () => {
    it('should return an object with core and documentViewer properties', () => {
      const store = createMockStore(1);
      const mockDocumentViewer = { mock: 'documentViewer' };
      core.getDocumentViewer.mockReturnValue(mockDocumentViewer);

      const { result } = renderHookWithStore(undefined, store);

      expect(result.current).toHaveProperty('core');
      expect(result.current).toHaveProperty('documentViewer');
      expect(result.current.documentViewer).toBe(mockDocumentViewer);
      expect(core.getDocumentViewer).toHaveBeenCalledWith(1);
    });

    it('should include all wrapped core properties in the returned core object', () => {
      const store = createMockStore(1);
      const { result } = renderHookWithStore(undefined, store);
      const wrappedCore = result.current.core;

      const expectedMethods = [
        'getSelectedAnnotations',
        'getToolMode',
        'getAnnotationManager',
        'canModify',
        'addEventListener',
        'removeEventListener',
        'getDocument',
        'getCurrentPage',
        'setCurrentPage',
        'getDisplayAuthor',
        'getOutlines',
        'getSelectedText',
        'getAnnotationsList',
        'getAnnotationsLoadedPromise',
        'getPrintablePDF',
        'getScrollViewElement',
        'getAnnotationById',
        'isFullPDFEnabled',
        'isAnnotationSelected',
        'deselectAnnotation',
        'deselectAnnotations',
        'deselectAllAnnotations',
        'jumpToAnnotation',
        'selectAnnotation',
        'selectAnnotations',
        'addAnnotations',
        'deleteAnnotations',
        'getGroupAnnotations',
        'getTool',
        'setToolMode',
        'getOfficeEditor',
        'getDocumentViewer',
        'getZoom',
        'fitToWidth',
        'fitToPage',
        'fitToHeight',
        'getCurrentUser',
        'getUserBookmarks',
        'setUserBookmarks',
        'addUserBookmark',
        'removeUserBookmark',
        'getSemanticDiffAnnotations',
      ];

      for (const method of expectedMethods) {
        expect(wrappedCore).toHaveProperty(method);
        expect(typeof wrappedCore[method]).toBe('function');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle key value of 0 by defaulting to 1', () => {
      const store = createMockStore(0);
      const { result } = renderHookWithStore(undefined, store);

      result.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(1);
    });

    it('should handle override key value of 0 by defaulting to 1', () => {
      const store = createMockStore(1);
      const { result } = renderHookWithStore(0, store);

      result.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenCalledWith(1);
    });

    it('should handle calling deleteAnnotations with only annotations parameter', () => {
      const store = createMockStore(2);
      const { result } = renderHookWithStore(undefined, store);
      const mockAnnotations = [{ id: 'test-111' }];

      result.current.core.deleteAnnotations(mockAnnotations);

      expect(core.deleteAnnotations).toHaveBeenCalledWith(mockAnnotations, undefined, 2);
    });
  });

  describe('Multiple Hook Instances', () => {
    it('should allow multiple instances with different override keys', () => {
      const store = createMockStore(1);

      const { result: result1 } = renderHookWithStore(2, store);
      const { result: result2 } = renderHookWithStore(3, store);

      result1.current.core.getSelectedAnnotations();
      result2.current.core.getSelectedAnnotations();

      expect(core.getSelectedAnnotations).toHaveBeenNthCalledWith(1, 2);
      expect(core.getSelectedAnnotations).toHaveBeenNthCalledWith(2, 3);
    });
  });
});
