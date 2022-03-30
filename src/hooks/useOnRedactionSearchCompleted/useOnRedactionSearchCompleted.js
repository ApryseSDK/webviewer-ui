import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import { redactionTypeMap } from '../../components/RedactionPageGroup/RedactionItem/RedactionItem';
import SearchStatus from 'constants/searchStatus';

function createRegexesFromSearchPatterns(regexes) {
  const patternLabels = Object.keys(regexes);
  const searchPatternsWithRegex = {};

  patternLabels.forEach(label => {
    const { regexString, type } = regexes[label];
    const regex = new RegExp(regexString);
    searchPatternsWithRegex[label] = {
      regex,
      type,
    };
  });

  return searchPatternsWithRegex;
};

function useOnRedactionSearchCompleted() {

  const [searchStatus, setSearchStatus] = useState(SearchStatus['SEARCH_NOT_INITIATED']);
  const [redactionSearchResults, setRedactionSearchResults] = useState([]);
  const [isProcessingRedactionResults, setIsProcessingRedactionResults] = useState(false);
  const [
    creditCardsPattern,
    phoneNumbersPattern,
    emailsPattern,
  ] = useSelector(
    state => [
      selectors.getRedactionSearchPattern(state, 'creditCards'),
      selectors.getRedactionSearchPattern(state, 'phoneNumbers'),
      selectors.getRedactionSearchPattern(state, 'emails'),
    ]
  );

  const searchPatterns = {
    creditCard: {
      regexString: creditCardsPattern,
      type: redactionTypeMap['CREDIT_CARD']
    },
    phone: {
      regexString: phoneNumbersPattern,
      type: redactionTypeMap['PHONE']
    },
    email: {
      regexString: emailsPattern,
      type: redactionTypeMap['EMAIL']
    }
  };

  // We memoize this because it is expensive to create the regexes every time we map over the search results to find out what type it is
  const searchPatternsWithRegex = useMemo(() => createRegexesFromSearchPatterns(searchPatterns),
    [creditCardsPattern, phoneNumbersPattern, emailsPattern]);

  const mapResultToType = useCallback((result) => {
    // Iterate through the patterns and return the first match
    const { resultStr } = result;
    const searchPatterns = Object.keys(searchPatternsWithRegex);

    const resultType = searchPatterns.find(searchPattern => {
      const { regex } = searchPatternsWithRegex[searchPattern];
      return regex.test(resultStr);
    });

    // If it didn't match any of the patterns, return the default type which is text
    result.type = resultType === undefined ? redactionTypeMap['TEXT'] : resultType;
    return result;

  }, [searchPatternsWithRegex]);//Dependency is an object but it is memoized so it will not re-create unless the patterns change

  const clearRedactionSearchResults = useCallback(() => {
    setRedactionSearchResults([]);
    core.clearSearchResults();
    setIsProcessingRedactionResults(false);
  });

  useEffect(() => {
    function onSearchResultsChanged(results) {
      const mappedResults = results.map(mapResultToType);
      setIsProcessingRedactionResults(true);
      setRedactionSearchResults(mappedResults)
    };

    core.addEventListener('searchResultsChanged', onSearchResultsChanged);
    return () => {
      core.removeEventListener('searchResultsChanged', onSearchResultsChanged);
    }
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
        }, 100)
      }
    }

    core.addEventListener('searchInProgress', searchInProgressEventHandler);

    return () => {
      core.removeEventListener('searchInProgress', searchInProgressEventHandler);
    }
  }, []);

  return {
    redactionSearchResults,
    isProcessingRedactionResults,
    clearRedactionSearchResults,
    searchStatus,
  }
};

export default useOnRedactionSearchCompleted;