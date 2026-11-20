import core from 'core';
import { createInstanceScopedState } from 'core/documentViewers';

const searchState = createInstanceScopedState(() => ({ listeners: [], overrideSearchExecutionFn: undefined }));

export function addSearchListener(searchListener) {
  searchState.get().listeners.push(searchListener);
}

export function removeSearchListener(searchListener) {
  const state = searchState.get();
  state.listeners = state.listeners.filter((listener) => {
    return listener !== searchListener;
  });
}

export function getSearchListeners() {
  return [...searchState.get().listeners];
}

export function clearSearchListeners() {
  searchState.get().listeners = [];
}

export function overrideSearchExecution(fn) {
  searchState.get().overrideSearchExecutionFn = fn;
}

export function getOverrideSearchExecution() {
  return searchState.get().overrideSearchExecutionFn;
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