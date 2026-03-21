import searchTextFullFactory from '../apis/searchTextFull';
import selectors from 'selectors';
import core from 'core';


function multiSearch(store) {
  return function multiSearch(searchTerms) {
    const { getState } = store;
    const state = getState();
    const redactionSearchPatterns = selectors.getRedactionSearchPatterns(state);
    // collect all regexes into an array
    const searchOptionsMap = Object.keys(redactionSearchPatterns).reduce((map, key) => {
      const { regex, type } = redactionSearchPatterns[key];
      map[type] = regex;
      return map;
    }, {});


    // Core only supports a single search term, so we join multiple terms with '|'
    // and always run the search as regex. Plain text terms are pre-escaped.
    const options = {
      regex: true,
      caseSensitive: searchTerms.caseSensitive,
    };

    const { textSearch } = searchTerms;
    const searchArray = [...textSearch];

    // Now we can map type to regex
    Object.keys(searchTerms).forEach((searchType) => {
      const searchRegex = searchOptionsMap[searchType];
      if (searchRegex) {
        searchArray.push(searchRegex.source);
      }
    });

    const searchString = searchArray.join('|');

    // If search string is empty we return and clear searches or we send the search logic
    // into an infinte loop
    if (searchString === '') {
      const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(state);
      core.clearSearchResults(activeDocumentViewerKey);
      return;
    }

    const searchTextFull = searchTextFullFactory(store);
    searchTextFull(searchString, options, true, { shouldDispatchUIActions: false });
  };
}

export default multiSearch;
