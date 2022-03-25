import React from 'react';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import SearchOverlay from './SearchOverlay.js';

export default {
  title: 'Components/SearchOverlay',
  component: SearchOverlay,
};

const initialState = {
  viewer:{
    disabledElements: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);
/* eslint-disable no-console */
function executeSearch() {
  console.log('Executing search');
}

function selectNextResult() {
  console.log('selectNextResult');
}

function selectPreviousResult() {
  console.log('selectPreviousResult');
}

export function Basic() {
  const [searchValue, setSearchValue] = React.useState('');
  const [isCaseSensitive, setCaseSensitive] = React.useState(false);
  const [isWholeWord, setWholeWord] = React.useState(false);
  const [isWildcard, setWildcard] = React.useState(false);
  const [searchStatus, setSearchStatus] = React.useState('SEARCH_NOT_INITIATED');
  const props = {
    searchValue,
    setSearchValue,
    isCaseSensitive,
    setCaseSensitive,
    isWholeWord,
    setWholeWord,
    isWildcard,
    setWildcard,
    executeSearch,
    setSearchStatus,
    selectNextResult,
    selectPreviousResult
  };
  return (
    <Provider store={store}>
      <div style={{ width: 300 }}>
        <SearchOverlay {...props} />
      </div>
    </Provider>
  );
}


