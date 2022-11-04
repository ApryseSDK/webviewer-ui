import React from 'react';
import core from 'core';
import { useDispatch } from 'react-redux';
import actions from 'actions/index';

function useSearch() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [activeSearchResult, setActiveSearchResult] = React.useState();
  const [activeSearchResultIndex, setActiveSearchResultIndex] = React.useState(0);
  const [searchStatus, setSearchStatus] = React.useState('SEARCH_NOT_INITIATED');
  const dispatch = useDispatch();

  React.useEffect(() => {
    // First time useSearch is mounted we check if core has results
    // and if it has, we make sure those are set. This will make sure if external search is done
    // that the result will reflect on the UI those set in core
    const coreSearchResults = core.getPageSearchResults() || [];
    if (coreSearchResults.length > 0) {
      const activeSearchResult = core.getActiveSearchResult();
      if (activeSearchResult) {
        const newActiveSearchResultIndex = coreSearchResults.findIndex((searchResult) => {
          return core.isSearchResultEqual(searchResult, activeSearchResult);
        });
        setSearchResults(coreSearchResults);
        if (newActiveSearchResultIndex >= 0) {
          setActiveSearchResult(coreSearchResults[newActiveSearchResultIndex]);
          setActiveSearchResultIndex(newActiveSearchResultIndex);
        }
      } else {
        setSearchResults(coreSearchResults);
        setActiveSearchResult(coreSearchResults[0]);
        setActiveSearchResultIndex(0);
      }
    }
  }, []);

  React.useEffect(() => {
    function activeSearchResultChanged(newActiveSearchResult) {
      const coreSearchResults = core.getPageSearchResults() || [];
      const newActiveSearchResultIndex = coreSearchResults.findIndex((searchResult) => {
        return core.isSearchResultEqual(searchResult, newActiveSearchResult);
      });
      if (newActiveSearchResultIndex >= 0) {
        setActiveSearchResult(newActiveSearchResult);
        setActiveSearchResultIndex(newActiveSearchResultIndex);
      }
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
        const defualtActiveSearchResult = core.getActiveSearchResult();

        if (defualtActiveSearchResult) {
          setActiveSearchResult(defualtActiveSearchResult);
          // In core default active search result is the first result
          const coreSearchResults = core.getPageSearchResults() || [];
          const newActiveSearchResultIndex = coreSearchResults.findIndex((searchResult) => {
            return core.isSearchResultEqual(searchResult, defualtActiveSearchResult);
          });
          setActiveSearchResultIndex(newActiveSearchResultIndex);
          dispatch(actions.setNextResultValue(defualtActiveSearchResult));
        }

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
  }, [setActiveSearchResult, setActiveSearchResultIndex, setSearchStatus, dispatch]);

  return {
    searchStatus,
    searchResults,
    activeSearchResult,
    activeSearchResultIndex,
    setSearchStatus,
  };
}

export default useSearch;
