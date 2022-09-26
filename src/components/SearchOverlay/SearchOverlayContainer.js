import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import SearchOverlay from './SearchOverlay';
import { getOverrideSearchExecution } from 'helpers/search';
import searchTextFullFactory from '../../apis/searchTextFull';
import core from 'core';
import actions from 'actions/index';

// exported so that we can test these internal functions
export function executeSearch(searchValue, options, store) {
  const searchOptions = {
    regex: false,
    ...options,
  };

  if (searchValue !== null && searchValue !== undefined) {
    // user can override search execution with instance.overrideSearchExecution()
    // Here we check if user has done that and call that rather than default search execution
    const overrideSearchExecution = getOverrideSearchExecution();
    if (overrideSearchExecution) {
      overrideSearchExecution(searchValue, searchOptions);
    } else {
      const searchTextFull = searchTextFullFactory(store);
      searchTextFull(searchValue, searchOptions);
    }
  }
}

export function selectNextResult(searchResults = [], activeResultIndex, dispatch) {
  if (searchResults.length > 0) {
    const nextResultIndex = activeResultIndex === searchResults.length - 1 ? 0 : activeResultIndex + 1;
    core.setActiveSearchResult(searchResults[nextResultIndex]);
    if (dispatch) {
      const nextIndex = (nextResultIndex > 0) ? nextResultIndex - 1 : 0;
      dispatch(actions.setNextResultValue(searchResults[nextResultIndex], nextIndex));
    }
  }
}

export function selectPreviousResult(searchResults = [], activeResultIndex, dispatch) {
  if (searchResults.length > 0) {
    const prevResultIndex = activeResultIndex <= 0 ? searchResults.length - 1 : activeResultIndex - 1;
    core.setActiveSearchResult(searchResults[prevResultIndex]);
    if (dispatch) {
      dispatch(actions.setNextResultValue(searchResults[prevResultIndex]));
    }
  }
}

function SearchOverlayContainer(props) {
  const dispatch = useDispatch();
  const store = useStore();
  return (
    <SearchOverlay
      executeSearch={(searchValue, options = {}) => {
        executeSearch(searchValue, options, store);
      }}
      selectNextResult={(searchResults = [], activeResultIndex) => {
        selectNextResult(searchResults, activeResultIndex, dispatch);
      }
      }
      selectPreviousResult={(searchResults = [], activeResultIndex) => {
        selectPreviousResult(searchResults, activeResultIndex, dispatch);
      }
      }
      {...props}
    />
  );
}

export default SearchOverlayContainer;
