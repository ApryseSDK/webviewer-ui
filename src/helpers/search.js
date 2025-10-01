import core from 'core';

let searchListeners = [];
let overrideSearchExecutionFn;

export function addSearchListener(searchListener) {
  searchListeners.push(searchListener);
}

export function removeSearchListener(searchListener) {
  searchListeners = searchListeners.filter((listener) => {
    return listener !== searchListener;
  });
}

export function getSearchListeners() {
  return [...searchListeners];
}

export function clearSearchListeners() {
  searchListeners = [];
}

export function overrideSearchExecution(fn) {
  overrideSearchExecutionFn = fn;
}

export function getOverrideSearchExecution() {
  return overrideSearchExecutionFn;
}

export function buildSearchModeArray(searchOptions) {
  const searchModes = [];
  const SearchMode = core.getSearchMode();

  if (searchOptions.wholeWord) {
    searchModes.push(SearchMode.WHOLE_WORD);
  }

  if (searchOptions.caseSensitive) {
    searchModes.push(SearchMode.CASE_SENSITIVE);
  }

  return searchModes;
}