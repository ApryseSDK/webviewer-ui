import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import SearchOverlay from './SearchOverlay';
import { workerTypes } from 'constants/types';
import core from 'core';
import DataElements from 'constants/dataElement';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'actions';
import { userEvent, within, expect } from 'storybook/test';

export default {
  title: 'Components/SearchOverlay',
  component: SearchOverlay,
  parameters: {
    chromatic: { delay: 500 },
  }
};

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

function SearchOverlayWrapper({ store, searchAndReplaceDisabled = true }) {
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => {},
    removeEventListener: () => {},
  });

  const [searchValue, setSearchValue] = React.useState('');
  const [isCaseSensitive, setCaseSensitive] = React.useState(false);
  const [isWholeWord, setWholeWord] = React.useState(false);
  const [isWildcard, setWildcard] = React.useState(false);
  const [searchStatus, setSearchStatus] = React.useState('SEARCH_NOT_INITIATED');
  const [replaceValue, setReplaceValue] = React.useState('');
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    store.dispatch(actions.addFlyout({
      dataElement: DataElements.SEARCH_OPTIONS_FLYOUT,
      className: 'SearchOptionsFlyout',
      items: [],
    }));

    if (searchAndReplaceDisabled) {
      store.dispatch(actions.disableElement('searchAndReplace'));
    }

    if (actions.enableFeatures) {
      store.dispatch(actions.enableFeatures(['customizableUI']));
    } else {
      console.warn('enableFeatures action not found, trying alternative approach');
    }
  }, [store, searchAndReplaceDisabled]);

  React.useEffect(() => {
    if (isMounted) {
      setTimeout(() => {
        const replaceToggleButton = document.querySelectorAll('.search-options-button')[1];
        if (replaceToggleButton) {
          replaceToggleButton.click();
        }
      }, 100);
    }
  }, [isMounted]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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

export function Basic() {
  const store = configureStore({
    reducer: rootReducer,
  });
  return <SearchOverlayWrapper store={store} />;
}

export function SearchAndReplaceEnabled() {
  const store = configureStore({
    reducer: rootReducer,
  });
  return <SearchOverlayWrapper store={store} searchAndReplaceDisabled={false} />;
}

SearchAndReplaceEnabled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const toggleReplaceInputButton = await canvas.getByRole('button', { name: 'Toggle replace input' });
  expect(toggleReplaceInputButton).toBeInTheDocument();
  await userEvent.click(toggleReplaceInputButton);
  const replaceInput = await canvas.getByRole('textbox', { name: 'Replace' });
  expect(replaceInput).toBeInTheDocument();
  const replaceAllButton = await canvas.getByRole('button', { name: 'Replace All' });
  expect(replaceAllButton).toBeInTheDocument();
  expect(replaceAllButton).toBeDisabled();
  const replaceButton = canvas.getByRole('button', { name: 'Replace' });
  expect(replaceButton).toBeInTheDocument();
  expect(replaceButton).toBeDisabled();
  await userEvent.click(toggleReplaceInputButton);
  expect(replaceInput).not.toBeInTheDocument();
};