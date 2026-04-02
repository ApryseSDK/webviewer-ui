import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useSearch from './useSearch';
import core from 'core';
import actions from 'actions';
import { isSpreadsheetEditorMode } from 'src/helpers/officeEditor';

jest.mock('core');
jest.mock('lodash', () => ({
  debounce: (fn) => fn,
}));
jest.mock('src/helpers/officeEditor', () => ({
  isSpreadsheetEditorMode: jest.fn(() => false),
}));
jest.mock('src/helpers/search', () => ({
  buildSearchModeArray: jest.fn((modes) => []),
}));

describe('useSearch', () => {
  let mockDocumentViewer;
  let mockStore;
  let eventListeners;
  let wrapper;

  beforeEach(() => {
    wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );
    eventListeners = {};
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(jest.fn());

    mockDocumentViewer = {
      addEventListener: jest.fn((eventName, handler) => {
        if (!eventListeners[eventName]) {
          eventListeners[eventName] = [];
        }
        eventListeners[eventName].push(handler);
      }),
      removeEventListener: jest.fn((eventName, handler) => {
        if (eventListeners[eventName]) {
          eventListeners[eventName] = eventListeners[eventName].filter((h) => h !== handler);
        }
      }),
      trigger: jest.fn((eventName, ...args) => {
        if (eventListeners[eventName]) {
          eventListeners[eventName].forEach((handler) => handler(...args));
        }
      }),
      search: jest.fn(() => ({ getAll: jest.fn().mockResolvedValue([]) })),
      getPageSearchResults: jest.fn(() => []),
      getActiveSearchResult: jest.fn(() => null),
    };

    core.getDocumentViewers = jest.fn(() => [mockDocumentViewer]);
    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
    core.isSearchResultEqual = jest.fn((a, b) => a === b);
    core.getDocument = jest.fn(() => ({
      getSpreadsheetEditorDocument: () => ({
        getWorkbook: () => ({
          sheetCount: 2,
          getSheetAt: (index) => ({ name: index === 0 ? 'Sheet1' : 'Sheet2' }),
        }),
      }),
    }));

    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((selector) => {
      const selectorString = selector.toString();
      if (selectorString.includes('getSearchValue')) {
        return 'test';
      }
      if (selectorString.includes('isCaseSensitive')) {
        return false;
      }
      if (selectorString.includes('isWholeWord')) {
        return false;
      }
      if (selectorString.includes('getSearchStatus')) {
        return 'SEARCH_NOT_INITIATED';
      }
      return null;
    });

    actions.setSearchStatus = jest.fn().mockReturnValue({ type: 'SET_SEARCH_STATUS' });
    actions.setSearchInProgress = jest.fn().mockReturnValue({ type: 'SET_SEARCH_IN_PROGRESS' });
    actions.setPageLabels = jest.fn().mockReturnValue({ type: 'SET_PAGE_LABELS' });

    mockStore = configureStore({
      reducer: (state = {
        search: {
          value: 'test',
          isCaseSensitive: false,
          isWholeWord: false,
          status: 'SEARCH_NOT_INITIATED',
        },
      }) => state,
    });
  });

  afterEach(() => {
    wrapper = null;
    jest.clearAllMocks();
  });

  describe('useSearch - searchResultsChanged event', () => {
    it('should call searchResultsChanged handler when documentViewer triggers searchResultsChanged event', () => {
      const { result } = renderHook(() => useSearch(1), { wrapper });

      expect(mockDocumentViewer.addEventListener).toHaveBeenCalledWith(
        'searchResultsChanged',
        expect.any(Function)
      );

      expect(result.current.searchResults).toEqual([]);

      const mockResults = [
        { pageNum: 0, resultStr: 'test', ambientStr: 'this is a test' },
        { pageNum: 1, resultStr: 'test', ambientStr: 'another test' },
      ];

      act(() => {
        mockDocumentViewer.trigger('searchResultsChanged', mockResults);
      });

      expect(result.current.searchResults).toEqual(mockResults);
      expect(result.current.searchResults.length).toBe(2);
    });

    it('should clear activeSearchResult when empty results are triggered', () => {
      const { result } = renderHook(() => useSearch(1), { wrapper });

      act(() => {
        mockDocumentViewer.trigger('searchResultsChanged', [
          { pageNum: 0, resultStr: 'test' }
        ]);
      });

      expect(result.current.searchResults.length).toBe(1);

      act(() => {
        mockDocumentViewer.trigger('searchResultsChanged', []);
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.activeSearchResult).toBeUndefined();
      expect(result.current.activeSearchResultIndex).toBe(-1);
    });

    it('should not re-register event listeners on re-render when dependencies are stable (core regression test)', () => {

      const { rerender } = renderHook(() => useSearch(1), { wrapper });

      const initialAddEventListenerCallCount = mockDocumentViewer.addEventListener.mock.calls.filter(
        (call) => call[0] === 'searchResultsChanged'
      ).length;
      expect(initialAddEventListenerCallCount).toBe(1);

      mockDocumentViewer.addEventListener.mockClear();
      mockDocumentViewer.removeEventListener.mockClear();

      act(() => {
        rerender();
      });

      const addEventListenerCalls = mockDocumentViewer.addEventListener.mock.calls.filter(
        (call) => call[0] === 'searchResultsChanged'
      );
      const removeEventListenerCalls = mockDocumentViewer.removeEventListener.mock.calls.filter(
        (call) => call[0] === 'searchResultsChanged'
      );

      expect(addEventListenerCalls.length).toBe(0); // Should not be called again
      expect(removeEventListenerCalls.length).toBe(0); // Should not be removed
    });
  });

  describe('useSearch - setSearchStatus', () => {
    it('isSearchInProgress should be false when search is not in progress', () => {
      const { result } = renderHook(() => useSearch(1));

      act(() => {
        result.current.setSearchStatus('SEARCH_DONE');
      });
      expect(actions.setSearchStatus).toHaveBeenCalledWith('SEARCH_DONE');
      expect(actions.setSearchInProgress).toHaveBeenCalledWith(false);
    });
  });

  describe('useSearch - refreshSpreadsheetLabelsAndSearch', () => {
    it('dispatches sheet labels and triggers search', () => {
      const { result } = renderHook(() => useSearch(1), { wrapper });

      act(() => {
        result.current.refreshSpreadsheetLabelsAndSearch();
      });

      expect(actions.setPageLabels).toHaveBeenCalledWith(['Sheet1', 'Sheet2']);
      expect(mockDocumentViewer.search).toHaveBeenCalledWith('test', []);
    });

    it('calls refresh path when sheetChanged event is triggered', () => {
      isSpreadsheetEditorMode.mockReturnValue(true);

      const coreEventListeners = {};
      core.addEventListener = jest.fn((eventName, handler) => {
        coreEventListeners[eventName] = handler;
      });
      core.removeEventListener = jest.fn((eventName) => {
        delete coreEventListeners[eventName];
      });

      renderHook(() => useSearch(1), { wrapper });

      actions.setPageLabels.mockClear();
      mockDocumentViewer.search.mockClear();

      act(() => {
        coreEventListeners.sheetChanged();
      });

      expect(actions.setPageLabels).toHaveBeenCalledWith(['Sheet1', 'Sheet2']);
      expect(mockDocumentViewer.search).toHaveBeenCalledWith('test', []);

      isSpreadsheetEditorMode.mockReturnValue(false);
    });
  });

  describe('MultiViewer mode', () => {
    const mockGetDocumentViewerWithResults = (mockResultsForViewer1 = [], mockResultsForViewer2 = []) => {
      core.getDocumentViewer.mockImplementation((key) => {
        if (key === 1) {
          return {
            ...mockDocumentViewer,
            getPageSearchResults: jest.fn(() => mockResultsForViewer1),
            getActiveSearchResult: jest.fn(() => mockResultsForViewer1?.[0]),
          };
        } else if (key === 2) {
          return {
            ...mockDocumentViewer,
            getPageSearchResults: jest.fn(() => mockResultsForViewer2),
            getActiveSearchResult: jest.fn(() => mockResultsForViewer2?.[0]),
          };
        }
        return mockDocumentViewer;
      });
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update search results when active viewer changes and results length is 0', () => {
      let activeKey = 1;
      const mockResultsForViewer1 = [{ pageNum: 0, resultStr: 'abc', ambientStr: 'abc' }];
      const mockResultsForViewer2 = [];
      mockGetDocumentViewerWithResults(mockResultsForViewer1, mockResultsForViewer2);

      const { result, rerender } = renderHook(() => useSearch(activeKey), { wrapper });

      expect(core.getDocumentViewer).toHaveBeenCalledWith(activeKey);
      expect(result.current.searchResults).toEqual(mockResultsForViewer1);
      expect(result.current.activeSearchResult).toBe(mockResultsForViewer1[0]);
      expect(result.current.activeSearchResultIndex).toBe(0);

      activeKey = 2;
      rerender();

      expect(core.getDocumentViewer).toHaveBeenCalledWith(activeKey);
      expect(result.current.searchResults).toEqual(mockResultsForViewer2);
      expect(result.current.activeSearchResult).toBeUndefined();
      expect(result.current.activeSearchResultIndex).toBe(-1);
    });


    it('should update search results when active viewer changes and results length is greater than 0', () => {
      let activeKey = 1;
      const mockResultsForViewer1 = [];
      const mockResultsForViewer2 = [{ pageNum: 0, resultStr: 'def', ambientStr: 'def' }];
      mockGetDocumentViewerWithResults(mockResultsForViewer1, mockResultsForViewer2);

      const { result, rerender } = renderHook(() => useSearch(activeKey), { wrapper });

      expect(core.getDocumentViewer).toHaveBeenCalledWith(activeKey);
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.activeSearchResult).toBeUndefined();
      expect(result.current.activeSearchResultIndex).toBe(-1);

      activeKey = 2;
      rerender();

      expect(core.getDocumentViewer).toHaveBeenCalledWith(activeKey);
      expect(result.current.searchResults).toEqual(mockResultsForViewer2);
      expect(result.current.activeSearchResult).toEqual(mockResultsForViewer2[0]);
      expect(result.current.activeSearchResultIndex).toBe(0);
    });

    it('should default to first result when active result from viewer is not found in its search results', () => {
      let activeKey = 1;
      const mockResultsForViewer1 = [{ pageNum: 0, resultStr: 'abc', ambientStr: 'abc' }];
      const staleActiveResult = { pageNum: 5, resultStr: 'stale', ambientStr: 'stale' };
      const mockResultsForViewer2 = [
        { pageNum: 1, resultStr: 'def', ambientStr: 'def' },
        { pageNum: 2, resultStr: 'ghi', ambientStr: 'ghi' },
      ];

      core.getDocumentViewer.mockImplementation((key) => {
        if (key === 1) {
          return {
            ...mockDocumentViewer,
            getPageSearchResults: jest.fn(() => mockResultsForViewer1),
            getActiveSearchResult: jest.fn(() => mockResultsForViewer1[0]),
          };
        } else if (key === 2) {
          return {
            ...mockDocumentViewer,
            getPageSearchResults: jest.fn(() => mockResultsForViewer2),
            getActiveSearchResult: jest.fn(() => staleActiveResult),
          };
        }
        return mockDocumentViewer;
      });

      const { result, rerender } = renderHook(() => useSearch(activeKey), { wrapper });

      expect(result.current.searchResults).toEqual(mockResultsForViewer1);
      expect(result.current.activeSearchResult).toBe(mockResultsForViewer1[0]);
      expect(result.current.activeSearchResultIndex).toBe(0);

      activeKey = 2;
      rerender();

      // Should fall back to first result since staleActiveResult is not in mockResultsForViewer2
      expect(result.current.searchResults).toEqual(mockResultsForViewer2);
      expect(result.current.activeSearchResult).toBe(mockResultsForViewer2[0]);
      expect(result.current.activeSearchResultIndex).toBe(0);
    });
  });
});
