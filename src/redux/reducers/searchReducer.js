export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SEARCH_TEXT': {
      const { searchValue, options = {} } = payload;
      const { caseSensitive, wholeWord, wildcard, regex, searchUp, ambientString } = options;
      return {
        ...state,
        value: searchValue,
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
      };
    }
    case 'SET_WHOLE_WORD': {
      return {
        ...state,
        isWholeWord: payload.isWholeWord,
      };
    }
    case 'SET_WILD_CARD': {
      return {
        ...state,
        isWildcard: payload.isWildcard,
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
    default:
      return state;
  }
};
