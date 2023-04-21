export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SEARCH_TEXT': {
      const { searchValue, replaceValue, options = {} } = payload;
      const { caseSensitive, wholeWord, wildcard, regex, searchUp, ambientString } = options;
      return {
        ...state,
        value: searchValue,
        replaceValue: replaceValue,
        nextResult: null,
        nextResultIndex: null,
        isCaseSensitive: caseSensitive || false,
        isWholeWord: wholeWord || false,
        isWildcard: wildcard || false,
        isRegex: regex || false,
        isSearchUp: searchUp || false,
        isAmbientString: ambientString || false,
      };
    }
    case 'SEARCH_TEXT_FULL': {
      const { searchValue, options = {} } = payload;
      const { caseSensitive, wholeWord, wildcard, regex } = options;
      return {
        ...state,
        value: searchValue,
        isCaseSensitive: caseSensitive || false,
        isWholeWord: wholeWord || false,
        isWildcard: wildcard || false,
        isRegex: regex || false,
        isSearchUp: false,
        isAmbientString: true,
      };
    }
    case 'SET_SEARCH_VALUE': {
      return {
        ...state,
        value: payload.value,
        nextResult: null,
        nextResultIndex: null,
      };
    }
    case 'SET_REPLACE_VALUE': {
      return {
        ...state,
        replaceValue: payload.replaceText,
      };
    }
    case 'SET_NEXT_RESULT': {
      return {
        ...state,
        nextResult: payload.nextResult,
        nextResultIndex: payload.nextResultIndex,
      };
    }
    case 'ADD_RESULT': {
      return {
        ...state,
        results: [...state.results, payload.result],
      };
    }
    case 'SET_CASE_SENSITIVE': {
      return {
        ...state,
        isCaseSensitive: payload.isCaseSensitive,
        nextResult: null,
        nextResultIndex: null,
      };
    }
    case 'SET_WHOLE_WORD': {
      return {
        ...state,
        isWholeWord: payload.isWholeWord,
        nextResult: null,
        nextResultIndex: null,
      };
    }
    case 'SET_WILD_CARD': {
      return {
        ...state,
        isWildcard: payload.isWildcard,
        nextResult: null,
        nextResultIndex: null,
      };
    }
    case 'SET_SEARCH_ERROR': {
      return {
        ...state,
        errorMessage: payload.errorMessage,
      };
    }
    case 'RESET_SEARCH': {
      return {
        ...initialState,
        value: state.value,
        isCaseSensitive: state.isCaseSensitive,
        isWholeWord: state.isWholeWord,
        isWildcard: state.isWildcard,
        nextResult: null,
        nextResultIndex: null,
      };
    }
    case 'SET_SEARCH_RESULTS': {
      return {
        ...state,
        results: payload,
      };
    }
    case 'SET_CLEAR_SEARCH_ON_PANEL_CLOSE': {
      return {
        ...state,
        clearSearchPanelOnClose: payload,
      };
    }
    case 'SET_PROCESSING_SEARCH_RESULTS': {
      return {
        ...state,
        isProcessingSearchResults: payload.isProcessingSearchResults,
      };
    }
    case 'REPLACE_REDACTION_SEARCH_PATTERN': {
      return {
        ...state,
        redactionSearchPatterns: {
          ...state.redactionSearchPatterns,
          [payload.searchPattern]: {
            ...state.redactionSearchPatterns[payload.searchPattern],
            regex: payload.regex,
          }
        }
      };
    }
    case 'ADD_REDACTION_SEARCH_PATTERN': {
      return {
        ...state,
        redactionSearchPatterns: {
          ...state.redactionSearchPatterns,
          [payload.searchPattern.type]: payload.searchPattern,
        }
      };
    }
    case 'REMOVE_REDACTION_SEARCH_PATTERN': {
      const updatedRedactionSearchPatterns = { ...state.redactionSearchPatterns };
      delete updatedRedactionSearchPatterns[payload.searchPatternType];
      return {
        ...state,
        redactionSearchPatterns: updatedRedactionSearchPatterns,
      };
    }
    default:
      return state;
  }
};
