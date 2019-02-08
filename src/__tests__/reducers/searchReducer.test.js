import searchReducer from 'reducers/searchReducer';
import initialState from 'src/redux/initialState.js';

describe('searchReducer', () => {
  test('SEARCH_TEXT', () => {
    const action = { 
      type: 'SEARCH_TEXT', 
      payload: { 
        searchValue: 'test', 
        options: {
          caseSensitive: 'test1',
          wholeWord: 'test2',
          wildcard: 'test3',
          regex: 'test4',
          searchUp: 'test5',
          ambientString: 'test6'
        }
      }
    };
    const expectedState = {
      ...initialState.search,
      value: 'test',
      isCaseSensitive: 'test1',
      isWholeWord: 'test2',
      isWildcard: 'test3',
      isRegex: 'test4',
      isSearchUp: 'test5',
      isAmbientString: 'test6',
      isProgrammaticSearch: true
    };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SEARCH_TEXT_FULL', () => {
    const action = {
      type: 'SEARCH_TEXT_FULL',
      payload: {
        searchValue: 'test',
        options: {
          caseSensitive: 'test1',
          wholeWord: 'test2',
          wildcard: 'test3',
          regex: 'test4'
        }
      }
    };
    const expectedState = {
      ...initialState.search,
      value: 'test',
      isCaseSensitive: 'test1',
      isWholeWord: 'test2',
      isWildcard: 'test3',
      isRegex: 'test4',
      isSearchUp: false,
      isAmbientString: true,
      isProgrammaticSearchFull: true
    };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });
  
  test('ADD_SEARCH_LISTENER and REMOVE_SEARCH_LISTENER', () => {
    const action = { type: 'ADD_SEARCH_LISTENER', payload: { func: 'test' } };
    const expectedState = { ...initialState.search, listeners: [ ...initialState.search.listeners, 'test' ] };
    const receivedState = searchReducer(initialState.search)(undefined, action);
    expect(receivedState).toEqual(expectedState);

    const removeAction = { type: 'REMOVE_SEARCH_LISTENER', payload: { func: 'test' } };
    const removedState = { ...initialState.search, listeners: [ ...initialState.search.listeners ] };
    expect(searchReducer(receivedState)(undefined, removeAction)).toEqual(removedState);
  });

  test('SET_SEARCH_VALUE', () => {
    const action = { type: 'SET_SEARCH_VALUE', payload: { value: 'test' } };
    const expectedState = { ...initialState.search, value: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_IS_PROG_SEARCH', () => {
    const action = { type: 'SET_IS_PROG_SEARCH', payload: { isProgrammaticSearch: 'test' } };
    const expectedState = { ...initialState.search, isProgrammaticSearch: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_IS_PROG_SEARCH_FULL', () => {
    const action = { type: 'SET_IS_PROG_SEARCH_FULL', payload: { isProgrammaticSearchFull: 'test' } };
    const expectedState = { ...initialState.search, isProgrammaticSearchFull: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState); 
  });

  test('SET_ACTIVE_RESULT', () => {
    const action = { type: 'SET_ACTIVE_RESULT', payload: { activeResult: 'test' } };
    const expectedState = { ...initialState.search, activeResult: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ACTIVE_RESULT_INDEX', () => {
    const action = { type: 'SET_ACTIVE_RESULT_INDEX', payload: { index: 'test' } };
    const expectedState = { ...initialState.search, activeResultIndex: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('ADD_RESULT', () => {
    const action = { type: 'ADD_RESULT', payload: { result: 'test' } };
    const expectedState = { ...initialState.search, results: [ ...initialState.search.results, 'test' ] };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_CASE_SENSITIVE', () => {
    const action = { type: 'SET_CASE_SENSITIVE', payload: { isCaseSensitive: 'test' } };
    const expectedState = { ...initialState.search, isCaseSensitive: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_WHOLE_WORD', () => {
    const action = { type: 'SET_WHOLE_WORD', payload: { isWholeWord: 'test' } };
    const expectedState = { ...initialState.search, isWholeWord: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_IS_SEARCHING', () => {
    const action = { type: 'SET_IS_SEARCHING', payload: { isSearching: 'test' } };
    const expectedState = { ...initialState.search, isSearching: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('SET_NO_RESULT', () => {
    const action = { type: 'SET_NO_RESULT', payload: { noResult: 'test' } };
    const expectedState = { ...initialState.search, noResult: 'test' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(expectedState);
  });

  test('RESET_SEARCH', () => {
    const action = { type: 'RESET_SEARCH' };
    expect(searchReducer(initialState.search)(undefined, action)).toEqual(initialState.search);
  });
  
});