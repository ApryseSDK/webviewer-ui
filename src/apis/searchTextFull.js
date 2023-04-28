/**
 * Searches the full document for the texts matching searchValue.
 * @method UI.searchTextFull
 * @param {string} searchValue The text value to look for.
 * @param {object} [options] Search options.
 * @param {boolean} [options.caseSensitive=false] Search with matching cases.
 * @param {boolean} [options.wholeWord=false] Search whole words only.
 * @param {boolean} [options.wildcard=false] Search a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Search for a regex string. For example, www(.*)com.
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.searchTextFull('test', {
        wholeWord: true
      });
    });
  });
 */

import actions from 'actions';
import core from 'core';
import { getSearchListeners } from 'helpers/search';
import { workerTypes } from 'constants/types';
import selectors from 'selectors';

const onResultThrottleTimeout = 100;

let isStillProcessingResults = false;

function buildSearchModeFlag(options = {}) {
  const SearchMode = core.getSearchMode();
  let searchMode = SearchMode.PAGE_STOP | SearchMode.HIGHLIGHT;

  if (options.caseSensitive) {
    searchMode |= SearchMode.CASE_SENSITIVE;
  }
  if (options.wholeWord) {
    searchMode |= SearchMode.WHOLE_WORD;
  }
  if (options.wildcard) {
    searchMode |= SearchMode.WILD_CARD;
  }
  if (options.regex) {
    searchMode |= SearchMode.REGEX;
  }

  searchMode |= SearchMode.AMBIENT_STRING;

  return searchMode;
}

export default (store) => (searchValue, options) => {
  const dispatch = store?.dispatch;
  // Store is optional. Default activeDocumentViewerKey is 1
  const activeDocumentViewerKey = store ? selectors.getActiveDocumentViewerKey(store.getState()) : 1;
  if (dispatch) {
    // dispatch is only set when doing search through API (instance.searchText())
    // When triggering search through UI, then redux updates are already handled inside component
    dispatch(actions.openElement('searchPanel'));
    dispatch(actions.searchTextFull(searchValue, options));
  }

  const searchMode = buildSearchModeFlag(options);
  let doneCallback = () => { };

  let hasActiveResultBeenSet = false;
  let throttleResults = [];
  let resultTimeout;

  function onResult(result) {
    throttleResults.push(result);
    if (!resultTimeout) {
      if (!isStillProcessingResults) {
        isStillProcessingResults = true;
      }
      const activeDocumentViewer = core.getDocumentViewer(activeDocumentViewerKey);

      resultTimeout = setTimeout(() => {
        activeDocumentViewer.displayAdditionalSearchResults(throttleResults);
        throttleResults = [];
        resultTimeout = null;
        doneCallback();
      }, onResultThrottleTimeout);
    }

    if (!hasActiveResultBeenSet && core.getDocument()?.getType() !== workerTypes.OFFICE_EDITOR) {
      // when full search is done, we make first found result to be the active result
      activeDocumentViewer.setActiveSearchResult(result);
      hasActiveResultBeenSet = true;
    }
  }

  function searchInProgressCallback(isSearching) {
    // execute search listeners when search is complete, thus hooking functionality search in progress event.
    if (isSearching === false) {
      doneCallback = () => {
        const activeDocumentViewer = core.getDocumentViewer(activeDocumentViewerKey);
        const results = activeDocumentViewer.getPageSearchResults();
        const searchOptions = {
          // default values
          caseSensitive: false,
          wholeWord: false,
          wildcard: false,
          regex: false,
          searchUp: false,
          ambientString: true,
          // override values with those user gave
          ...options,
        };
        const nextResultIndex = store?.getState().search?.nextResultIndex;

        const result = results[nextResultIndex];
        if (result) {
          // when full search is done, we make first found result to be the active result
          activeDocumentViewer.setActiveSearchResult(result);
        }
        const searchListeners = getSearchListeners() || [];
        searchListeners.forEach((listener) => {
          try {
            listener(searchValue, searchOptions, results);
          } catch (e) {
            console.error(e);
          }
        });
      };
      isStillProcessingResults = false;

      if (!resultTimeout) {
        doneCallback();
      }
      activeDocumentViewer.removeEventListener('searchInProgress', searchInProgressCallback);
    }
  }

  function onDocumentEnd() { }

  function handleSearchError(error) {
    dispatch(actions.setProcessingSearchResults(false));
    console.error(error);
  }
  const textSearchInitOptions = {
    'fullSearch': true,
    onResult,
    onDocumentEnd,
    'onError': handleSearchError,
  };

  const activeDocumentViewer = core.getDocumentViewer(activeDocumentViewerKey);

  activeDocumentViewer.clearSearchResults();
  activeDocumentViewer.textSearchInit(searchValue, searchMode, textSearchInitOptions);
  activeDocumentViewer.addEventListener('searchInProgress', searchInProgressCallback);
};
