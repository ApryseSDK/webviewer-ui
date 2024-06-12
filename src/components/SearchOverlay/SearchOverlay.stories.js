import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import SearchOverlay from './SearchOverlay';
import { workerTypes } from 'constants/types';
import core from 'core';

export default {
  title: 'Components/SearchOverlay',
  component: SearchOverlay,
};

const initialState = {
  viewer: {
    disabledElements: {},
  }
};
function rootReducer(state = initialState) {
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
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => {},
  });

  const [searchValue, setSearchValue] = React.useState('');
  const [isCaseSensitive, setCaseSensitive] = React.useState(false);
  const [isWholeWord, setWholeWord] = React.useState(false);
  const [isWildcard, setWildcard] = React.useState(false);
  const [searchStatus, setSearchStatus] = React.useState('SEARCH_NOT_INITIATED');
  const [replaceValue, setReplaceValue] = React.useState('');
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
    setReplaceValue,
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
