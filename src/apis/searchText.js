/**
 * Searches the document one by one for the text matching searchValue. To go to the next result this
 * function must be called again. Once document end is reach it will jump back to the first found result.
 *
 * @method UI.searchText
 * @param {string} searchValue The text value to look for.
 * @param {object} [options] Search options.
 * @param {boolean} [options.caseSensitive=false] Search with matching cases.
 * @param {boolean} [options.wholeWord=false] Search whole words only.
 * @param {boolean} [options.wildcard=false] Search a string with a wildcard *. For example, *viewer.
 * @param {boolean} [options.regex=false] Search for a regex string. For example, www(.*)com.
 * @param {boolean} [options.searchUp=false] Search up the document (backwards).
 * @param {boolean} [options.ambientString=false] Get the ambient string in the result.
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.UI.searchText('test', {
        caseSensitive: true,
        wholeWord: true
      });
    });
  });
 */

import core from 'core';
import actions from 'actions';
import { getSearchListeners } from "helpers/search";

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
  if (options.searchUp) {
    searchMode |= SearchMode.SEARCH_UP;
  }
  if (options.ambientString) {
    searchMode |= SearchMode.AMBIENT_STRING;
  }
  return searchMode;
}

export default function searchText(dispatch) {
  return function searchText(searchValue, options) {
    let searchOptions = {};
    if (typeof options === 'string') {
      const modes = options.split(',');
      modes.forEach(mode => {
        searchOptions[lowerCaseFirstLetter(mode)] = true;
      });
    } else {
      searchOptions = { ...options };
    }

    const searchMode = buildSearchModeFlag(searchOptions);

    if (dispatch) {
      // dispatch is only set when doing search through API (instance.searchText())
      // When triggering search through UI, then redux updates are already handled inside component
      dispatch(actions.openElement('searchPanel'));
      dispatch(actions.searchText(searchValue, searchOptions));
    }

    function onResult(result) {
      core.displaySearchResult(result);
      core.setActiveSearchResult(result);
      const optionsForSearchListener = {
        // default values
        caseSensitive: false,
        wholeWord: false,
        wildcard: false,
        regex: false,
        searchUp: false,
        ambientString: false,
        // override values with those user gave
        ...searchOptions,
      };
      const searchListeners = getSearchListeners() || [];
      searchListeners.forEach(listener => {
        try {
          listener(searchValue, optionsForSearchListener, [result]);
        } catch (e) {
          console.error(e);
        }
      });
    }

    function onDocumentEnd() {
      core.getDocumentViewer().trigger('endOfDocumentResult', true);
    }
    function handleSearchError(error) {
      console.error(error);
    }
    const textSearchInitOptions = {
      'fullSearch': false,
      onResult,
      onDocumentEnd,
      'onError': handleSearchError,
    };

    core.textSearchInit(searchValue, searchMode, textSearchInitOptions);
  };
}


const lowerCaseFirstLetter = mode => `${mode.charAt(0).toLowerCase()}${mode.slice(1)}`;
