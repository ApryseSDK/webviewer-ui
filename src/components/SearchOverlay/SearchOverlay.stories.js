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
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import initialState from 'src/redux/initialState';
import PropTypes from 'prop-types';

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

function SearchOverlayWrapper({ store, searchAndReplaceDisabled = true, searchResultsUpdate, searchStatusInStore, showReplaceSpinner }) {
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
  const [searchResults, setSearchResults] = React.useState([]);

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
    if (searchResultsUpdate) {
      // "replace all" button depend on a "useEffect", so need to update state to simulate real behavior
      setSearchResults(searchResultsUpdate);
      setSearchStatus('SEARCH_DONE');
    }
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
    selectPreviousResult,
    searchStatus: searchStatusInStore,
    searchResults,
    showReplaceSpinner
  };

  return (
    <Provider store={store}>
      <div style={{ width: 300 }}>
        <SearchOverlay {...props} />
      </div>
    </Provider>
  );
}

SearchOverlayWrapper.propTypes = {
  store: PropTypes.object.isRequired,
  searchAndReplaceDisabled: PropTypes.bool,
  searchResultsUpdate: PropTypes.array,
  searchStatusInStore: PropTypes.string,
};

const searchAndReplaceEnabledStore = configureStore({
  reducer: () => ({
    ...initialState,
    viewer: {
      disabledElements: {
        searchAndReplace: { disabled: false, priority: 2 },
        ...initialState.viewer.disabledElements,
      },
      ...initialState.viewer,
    },
  }),
});

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
  const toggleReplaceInputButton = await canvas.getByRole('button', { name: getTranslatedText('message.toggleReplaceInput') });
  expect(toggleReplaceInputButton).toBeInTheDocument();
  await userEvent.click(toggleReplaceInputButton);
  const replaceInput = await canvas.getByRole('textbox', { name: getTranslatedText('action.replace') });
  expect(replaceInput).toBeInTheDocument();
  const replaceAllButton = await canvas.getByRole('button', { name: getTranslatedText('option.searchPanel.replaceAll') });
  expect(replaceAllButton).toBeInTheDocument();
  expect(replaceAllButton).toBeDisabled();
  const replaceButton = canvas.getByRole('button', { name: getTranslatedText('action.replace') });
  expect(replaceButton).toBeInTheDocument();
  expect(replaceButton).toBeDisabled();
  await userEvent.click(toggleReplaceInputButton);
  expect(replaceInput).not.toBeInTheDocument();
};

export function SearchAndReplaceFoundResults() {
  return <SearchOverlayWrapper
    store={searchAndReplaceEnabledStore}
    searchAndReplaceDisabled={false}
    searchResultsUpdate={[{}, {}, {}, {}]}
    searchStatusInStore='SEARCH_DONE'
  />;
}

SearchAndReplaceFoundResults.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const resultsFoundText = `4 ${getTranslatedText('message.numResultsFound')}`;
  expect(await canvas.findByText(resultsFoundText)).toBeInTheDocument();

  const replaceInput = await canvas.findByRole('textbox', { name: getTranslatedText('option.searchPanel.replace') });
  expect(replaceInput).toBeInTheDocument();

  const replaceAllButton = await canvas.findByRole('button', { name: getTranslatedText('option.searchPanel.replaceAll') });
  expect(replaceAllButton).toBeInTheDocument();
  expect(replaceAllButton).toBeEnabled();
};

export function SearchAndReplaceNoResults() {
  return <SearchOverlayWrapper
    store={searchAndReplaceEnabledStore}
    searchAndReplaceDisabled={false}
    searchResults={[]}
    searchStatusInStore='SEARCH_DONE'
  />;
}

SearchAndReplaceNoResults.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const resultsFoundText = `0 ${getTranslatedText('message.numResultsFound')}`;
  await canvas.findAllByText(resultsFoundText);
  const replaceInput = await canvas.findByRole('textbox', { name: getTranslatedText('option.searchPanel.replace') });
  expect(replaceInput).toBeInTheDocument();

  const replaceAllButton = await canvas.findByRole('button', { name: getTranslatedText('option.searchPanel.replaceAll') });
  expect(replaceAllButton).toBeInTheDocument();
  expect(replaceAllButton).toBeDisabled();
};

export function SearchAndReplaceActivelyReplacing() {
  return <SearchOverlayWrapper
    store={searchAndReplaceEnabledStore}
    searchAndReplaceDisabled={false}
    searchResultsUpdate={[{}, {}, {}, {}]}
    searchStatusInStore='SEARCH_DONE'
    showReplaceSpinner={true}
  />;
}