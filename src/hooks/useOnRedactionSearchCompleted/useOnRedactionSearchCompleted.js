import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import { redactionTypeMap } from 'constants/redactionTypes';
import SearchStatus from 'constants/searchStatus';

//This runs the pattern against the ambient string of the search result (containing the match with surrounding words).
//That's so that the pattern can properly use lookbehinds or lookaheads. However, it does require the actual match to
//be in the resultStr, to make sure we're not matching something before or after the result.
function patternMatchesResult(searchResult, pattern) {
  //First check if the pattern matches the result string, if so we don't need to test further.
  if (pattern.test(searchResult.resultStr)) {
    return true;
  }
  const result = pattern.exec(searchResult.ambientStr);
  if (result !== null && result.index >= searchResult.resultStrStart && result.index <= searchResult.resultStrEnd) {
    return true
  }
  return false
}


function useOnRedactionSearchCompleted() {
  const [searchStatus, setSearchStatus] = useState(SearchStatus['SEARCH_NOT_INITIATED']);
  const [redactionSearchResults, setRedactionSearchResults] = useState([]);
  const [isProcessingRedactionResults, setIsProcessingRedactionResults] = useState(false);
  const [patternsInUse, setPatternsInUse] = useState([]);
  const redactionSearchPatterns = useSelector((state) => selectors.getRedactionSearchPatterns(state), shallowEqual);

  const searchPatterns = useMemo(() => {
    return Object.keys(redactionSearchPatterns).reduce((map, key) => {
      const { regex, type, icon } = redactionSearchPatterns[key];
      map[type] = {
        regex,
        icon
      };
      return map;
    }, {});
  }, [redactionSearchPatterns]);

  const mapResultToType = useCallback((result) => {
    if (patternsInUse.length === 1) {
      result.type = patternsInUse[0].type
    } else {
      // Iterate through the patterns and return the first match
      let resultType = undefined
      for (let pattern of patternsInUse) {
        if (pattern.type === 'text') {
          continue;
        }
        if (patternMatchesResult(result, pattern.regex)) {
          resultType = pattern.type
          break;
        }
      }
      // If it didn't match any of the patterns, return the default type which is text
      result.type = resultType === undefined ? redactionTypeMap['TEXT'] : resultType;
    }
    // And also set the icon to display in the panel. If no icon provided use the text icon
    const { icon = 'icon-form-field-text' } = searchPatterns[result.type] || {};
    result.icon = icon;
    return result;
  }, [searchPatterns, patternsInUse]);

  const clearRedactionSearchResults = useCallback(() => {
    setRedactionSearchResults([]);
    core.clearSearchResults();
    setIsProcessingRedactionResults(false);
  });

  useEffect(() => {
    function onSearchResultsChanged(results) {
      const mappedResults = results.map(mapResultToType);
      setIsProcessingRedactionResults(true);
      setRedactionSearchResults(mappedResults);
    }

    core.addEventListener('searchResultsChanged', onSearchResultsChanged);
    return () => {
      core.removeEventListener('searchResultsChanged', onSearchResultsChanged);
    };
  }, [searchStatus]);

  useEffect(() => {
    function searchInProgressEventHandler(isSearching) {
      if (isSearching === undefined || isSearching === null) {
        // if isSearching is not passed at all, we consider that to mean that search was reset to original state
        setSearchStatus(SearchStatus['SEARCH_NOT_INITIATED']);
      } else if (isSearching) {
        setSearchStatus(SearchStatus['SEARCH_IN_PROGRESS']);
      } else {
        setSearchStatus(SearchStatus['SEARCH_DONE']);
        // Need a timeout due to timing issue as SEARCH_DONE is fired
        // before final call to onSearchResultsChanged, otherwise we briefly show
        // the NO RESULTS message before showing actual results.
        setTimeout(() => {
          setIsProcessingRedactionResults(false);
        }, 100);
      }
    }

    core.addEventListener('searchInProgress', searchInProgressEventHandler);

    return () => {
      core.removeEventListener('searchInProgress', searchInProgressEventHandler);
    };
  }, []);

  return {
    redactionSearchResults,
    isProcessingRedactionResults,
    clearRedactionSearchResults,
    searchStatus,
    patternsInUse,
    setPatternsInUse
  };
}

export default useOnRedactionSearchCompleted;