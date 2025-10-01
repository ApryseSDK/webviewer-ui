import React from 'react';
import SearchResultsContainer, { SearchResult } from './SearchResult';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import { within, expect } from 'storybook/test';
import { default as mockAppInitialState } from 'src/redux/initialState';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { workerTypes } from 'constants/types';

export default {
  title: 'ModularComponents/SearchResult',
  component: SearchResultsContainer,
};

function SearchResultWithMockHeight(props) {
  return (
    <div className="results">
      <SearchResult height={350} {...props} />
    </div>
  );
}

const mockSearchResults = [
  {
    pageNum: 1,
    sheetOrder: 1,
    cell: 'A1',
    ambientStr: 'Revenue data for Q1',
    resultStrStart: 0,
    resultStrEnd: 7,
    resultStr: 'Revenue'
  },
  {
    pageNum: 1,
    sheetOrder: 1,
    cell: 'B5',
    ambientStr: 'Total revenue calculation',
    resultStrStart: 6,
    resultStrEnd: 13,
    resultStr: 'revenue'
  },
  {
    pageNum: 2,
    sheetOrder: 2,
    cell: 'C3',
    ambientStr: 'Revenue growth metrics',
    resultStrStart: 0,
    resultStrEnd: 7,
    resultStr: 'Revenue'
  }
];

const initialState = {
  ...mockAppInitialState,
  viewer: {
    ...mockAppInitialState.viewer,
    openElements: {
      ...mockAppInitialState.viewer.openElements,
      panel: true,
    },
    pageLabels: [],
  },
  search: {
    ...mockAppInitialState.search,
    searchResults: mockSearchResults,
    activeResultIndex: 0,
    searchStatus: 'SEARCH_DONE'
  },
  featureFlags: {
    ...mockAppInitialState.featureFlags,
    customizableUI: true
  }
};


export function SearchResultSpreadsheetMode() {
  // Switch the global mock document type for this story (provided by preview.js)
  if (typeof window.setDocType === 'function') {
    window.setDocType(workerTypes.SPREADSHEET_EDITOR);
  }
  const store = configureStore({ reducer: () => initialState });

  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <SearchResultWithMockHeight
            searchResults={mockSearchResults}
            activeResultIndex={0}
            searchStatus="SEARCH_DONE"
            t={getTranslatedText}
            onClickResult={() => {}}
            pageLabels={['1', '2', '3']}
            isProcessingSearchResults={false}
            isSearchInProgress={false}
            activeDocumentViewerKey={1}
          />
        </div>
      </Panel>
    </Provider>
  );
}

SearchResultSpreadsheetMode.play = async ({ canvasElement, globals }) => {
  const canvas = within(canvasElement);
  const searchResultsGrid = canvas.getByLabelText('grid');
  expect(searchResultsGrid).toBeTruthy();
  const isRtl = globals.addonRtl === 'rtl';
  const searchResultLabel = isRtl ? `Revenue growth metrics:C3 ${getTranslatedText('action.goToResult')}` : `${getTranslatedText('action.goToResult')} C3:Revenue growth metrics`;
  expect(await canvas.findByLabelText(`${searchResultLabel}`)).toBeTruthy();
  // Restore default doc type to avoid leaking state to other stories
  if (typeof window.setDocType === 'function') {
    window.setDocType(workerTypes.PDF);
  }
};

export function SearchResultNoResults() {
  const stateWithNoResults = {
    ...initialState,
    search: {
      ...initialState.search,
      searchResults: [],
      activeResultIndex: -1,
      searchStatus: 'SEARCH_DONE'
    }
  };

  const store = configureStore({ reducer: () => stateWithNoResults });

  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <SearchResultWithMockHeight
            searchResults={[]}
            activeResultIndex={-1}
            searchStatus="SEARCH_DONE"
            t={getTranslatedText}
            onClickResult={() => {}}
            pageLabels={['1', '2', '3']}
            isProcessingSearchResults={false}
            isSearchInProgress={false}
            activeDocumentViewerKey={1}
          />
        </div>
      </Panel>
    </Provider>
  );
}

SearchResultNoResults.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const noResultsMessage = await canvas.findByText(getTranslatedText('message.noResults'));
  expect(noResultsMessage).toBeInTheDocument();
};