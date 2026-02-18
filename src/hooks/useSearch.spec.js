import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useSearch from './useSearch';
import core from 'core';

jest.mock('core');
jest.mock('src/helpers/officeEditor', () => ({
  isSpreadsheetEditorMode: jest.fn(() => false),
}));
jest.mock('src/helpers/search', () => ({
  buildSearchModeArray: jest.fn((modes) => []),
}));

describe('useSearch - searchResultsChanged event', () => {
  let mockDocumentViewer;
  let mockStore;
  let eventListeners;

  beforeEach(() => {
    eventListeners = {};

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
      getPageSearchResults: jest.fn(() => []),
      getActiveSearchResult: jest.fn(() => null),
    };

    core.getDocumentViewers = jest.fn(() => [mockDocumentViewer]);
    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
    core.isSearchResultEqual = jest.fn((a, b) => a === b);

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
    jest.clearAllMocks();
  });

  it('should call searchResultsChanged handler when documentViewer triggers searchResultsChanged event', () => {
    const wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

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
    const wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

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

    const wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

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
