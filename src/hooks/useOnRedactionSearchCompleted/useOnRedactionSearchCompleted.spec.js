import React from 'react';
import * as reactRedux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import useOnRedactionSearchCompleted from './useOnRedactionSearchCompleted';
import core from 'core';
import { act } from 'react-dom/test-utils';
import { redactionTypeMap } from '../../components/RedactionPageGroup/RedactionItem/RedactionItem';

jest.mock('core');

//These patterns will be used for the tests
const patterns = {
  creditCards: '\\b(?:\\d[ -]*?){13,16}\\b',
  phoneNumbers: '\\d?(\\s?|-?|\\+?|\\.?)((\\(\\d{1,4}\\))|(\\d{1,3})|\\s?)(\\s?|-?|\\.?)((\\(\\d{1,3}\\))|(\\d{1,3})|\\s?)(\\s?|-?|\\.?)((\\(\\d{1,3}\\))|(\\d{1,3})|\\s?)(\\s?|-?|\\.?)\\d{3}(-|\\.|\\s)\\d{4,5}',
  emails: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}\\b',
};

const mockSearchResults = [
  {
    resultStr: "spice",
    ambientStr: "The spice must flow.",
    resultStrStart: 4,
    resultStrEnd: 9,
    index: 0,
    pageNum: 1
  },
  {
    resultStr: '4242 4242 4242 4242',
    index: 1,
    pageNum: 1
  },
  {
    resultStr: "867-5309",
    index: 3,
    pageNum: 2
  },
  {
    resultStr: "paul.atreides@dune.com",
    index: 4,
    pageNum: 3
  }
];

// To test a hook with a redux dependency we need to provide a wrapper for it to run.
// The wrapper must also have a redux provider
const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent)

describe('useOnRedactionSearchCompleted hook', () => {
  it('adds event listeners to searchResultsChanged and searchInProgress', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(() => useOnRedactionSearchCompleted(), { wrapper });

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('searchResultsChanged', expect.any(Function));
    expect(core.addEventListener).toBeCalledWith('searchInProgress', expect.any(Function));
  });


  it('removes event listeners to searchResultsChanged and searchInProgress when unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(() => useOnRedactionSearchCompleted(), { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('searchResultsChanged', expect.any(Function));
    expect(core.removeEventListener).toBeCalledWith('searchInProgress', expect.any(Function));
  });

  it('results from the search are correctly mapped to the right type of redactionType', () => {
    // This is a workaround to get the handler for searchResultsChanged so we can test it, as it is not possible (or easy) to mock an event
    let onSearchResultsChangedHandler;
    core.addEventListener = (event, handler) => {
      if (event === 'searchResultsChanged') {
        onSearchResultsChangedHandler = handler;
      }
    };

    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([
      patterns.creditCards,
      patterns.phoneNumbers,
      patterns.emails
    ]);


    const { result } = renderHook(() => useOnRedactionSearchCompleted(), { wrapper });
    expect(result.error).toBeUndefined();
    // The handler updates the internal state of the hook so it needs to be wrapped in act
    act(() => onSearchResultsChangedHandler(mockSearchResults));

    const { redactionSearchResults } = result.current;
    expect(redactionSearchResults.length).toEqual(mockSearchResults.length);
    expect(redactionSearchResults[0].type).toEqual(redactionTypeMap['TEXT']);
    expect(redactionSearchResults[1].type).toEqual(redactionTypeMap['CREDIT_CARD']);
    expect(redactionSearchResults[2].type).toEqual(redactionTypeMap['PHONE']);
    expect(redactionSearchResults[3].type).toEqual(redactionTypeMap['EMAIL']);
  });

  it('calling clearRedactionSearchResults results clears any results stored in the hook', () => {
    // This is a workaround to get the handler for searchResultsChanged so we can test it, as it is not possible (or easy) to mock an event
    let onSearchResultsChangedHandler;
    core.addEventListener = (event, handler) => {
      if (event === 'searchResultsChanged') {
        onSearchResultsChangedHandler = handler;
      }
    };

    const { result } = renderHook(() => useOnRedactionSearchCompleted(), { wrapper });
    expect(result.error).toBeUndefined();
    // The handler updates the internal state of the hook so it needs to be wrapped in act
    act(() => onSearchResultsChangedHandler(mockSearchResults));

    expect(result.current.redactionSearchResults.length).toEqual(mockSearchResults.length);

    act(() => result.current.clearRedactionSearchResults());

    expect(result.current.redactionSearchResults.length).toBe(0);
  });

  it('sets the correct searchStatus in the searchInProgress callback', async () => {
    // This is a workaround to get the handler for searchInProgress so we can test it, as it is not possible (or easy) to mock an event
    let onSearchInProgress;
    core.addEventListener = (event, handler) => {
      if (event === 'searchInProgress') {
        onSearchInProgress = handler;
      }
    };

    const { result } = renderHook(() => useOnRedactionSearchCompleted(), { wrapper });
    expect(result.error).toBeUndefined();

    // If called with null or undefined, the search status should be SEARCH_NOT_INITIATED
    act(() => onSearchInProgress(null));
    expect(result.current.searchStatus).toEqual('SEARCH_NOT_INITIATED');

    // If called with true it means that a search is in progress
    act(() => onSearchInProgress(true));
    expect(result.current.searchStatus).toEqual('SEARCH_IN_PROGRESS');

    // If called with false our search is done
    act(() => onSearchInProgress(false));
    expect(result.current.searchStatus).toEqual('SEARCH_DONE');
  });
});