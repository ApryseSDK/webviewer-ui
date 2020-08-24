let searchListeners = [];
let overrideSearchExecutionFn;

export function addSearchListener(searchListener) {
  searchListeners.push(searchListener);
}

export function removeSearchListener(searchListener) {
  searchListeners = searchListeners.filter(listener => {
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
