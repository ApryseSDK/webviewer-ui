import React from 'react';
import core from 'core';
import isSearchResultSame from "helpers/isSearchResultSame";

function useSearch() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [activeSearchResult, setActiveSearchResult] = React.useState();
  const [activeSearchResultIndex, setActiveSearchResultIndex] = React.useState(-1);
  const [searchStatus, setSearchStatus] = React.useState('SEARCH_NOT_INITIATED');

  React.useEffect(() => {
    function activeSearchResultChanged(newActiveSearchResult) {
      const searchResults = core.getPageSearchResults() || [];
      const newActiveSearchResultIndex = searchResults.findIndex(searchResult => {
        return isSearchResultSame(searchResult, newActiveSearchResult);
      });
      setActiveSearchResult(newActiveSearchResult);
      setActiveSearchResultIndex(newActiveSearchResultIndex);
    }

    function searchResultsChanged(newSearchResults = []) {
      setSearchResults(newSearchResults);
      if (newSearchResults && newSearchResults.length === 0) {
        setActiveSearchResult(undefined);
        setActiveSearchResultIndex(-1);
      }
    }

    function searchInProgressEventHandler(isSearching) {
      if (isSearching === undefined || isSearching === null) {
        // if isSearching is not passed at all, we consider that to mean that search was reset to original state
        setSearchStatus('SEARCH_NOT_INITIATED');
      } else if (isSearching) {
        setSearchStatus('SEARCH_IN_PROGRESS');
      } else {
        setSearchStatus('SEARCH_DONE');
      }
    }
    core.addEventListener('activeSearchResultChanged', activeSearchResultChanged);
    core.addEventListener('searchResultsChanged', searchResultsChanged);
    core.addEventListener('searchInProgress', searchInProgressEventHandler);
    return function useSearchEffectCleanup() {
      core.removeEventListener('activeSearchResultChanged', activeSearchResultChanged);
      core.removeEventListener('searchResultsChanged', searchResultsChanged);
      core.removeEventListener('searchInProgress', searchInProgressEventHandler);
    };
  }, [setActiveSearchResult, setActiveSearchResultIndex, setSearchStatus]);

  return {
    searchStatus,
    searchResults,
    activeSearchResult,
    activeSearchResultIndex,
  };
}

export default useSearch;
