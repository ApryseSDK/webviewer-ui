import React from 'react';
import SearchPanelContainer from './SearchPanelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import core from 'core';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { default as mockAppInitialState } from 'src/redux/initialState';
import { within, expect } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { mobileStoryParameters, disableRtlModeParameters } from 'helpers/storybookParams';

export default {
  title: 'ModularComponents/SearchPanel',
  component: SearchPanelContainer,
};

const initialState = {
  viewer: {
    openElements: {
      panel: true,
    },
    disabledElements: {},
    customElementOverrides: {},
    tab: {},
    panelWidths: { panel: 300 },
    modularHeaders: {},
    pageLabels: { 1: ['1', '2', '3'] },
    flyoutMap: {
      searchOptionsFlyout: {
        dataElement: 'searchOptionsFlyout',
        items: [],
      }
    },
    flyoutPosition: null,
    openFlyout: null,
  },
  search: {
    status: 'SEARCH_NOT_INITIATED',
  },
  featureFlags: {
    customizableUI: true
  },
  officeEditor: {
    isReplaceInProgress: false,
  },
};

const store = configureStore({ reducer: () => initialState });

export function SearchPanelLeft() {
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <SearchPanelContainer />
      </Panel>
    </Provider>
  );
}

SearchPanelLeft.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const searchInput = await canvas.findByRole('textbox', { name: getTranslatedText('message.searchDocumentPlaceholder') });
  expect(searchInput).toBeInTheDocument();

  const replaceToggleButton = canvas.getByRole('button', { name: getTranslatedText('option.searchPanel.replaceOptions') });
  await replaceToggleButton.click();
};

export function SearchPanelRight() {
  const stateWithSearchValue = {
    ...initialState,
    search: {
      value: 'Test search',
    },
  };
  return (
    <Provider store={configureStore({ reducer: () => stateWithSearchValue })}>
      <Panel location={'right'} dataElement={'panel'}>
        <SearchPanelContainer />
      </Panel>
    </Provider>
  );
}

SearchPanelRight.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const searchInput = await canvas.findByRole('textbox', { name: getTranslatedText('message.searchDocumentPlaceholder') });
  expect(searchInput).toBeInTheDocument();
  const clearSearchButton = await canvas.findByRole('button', { name: getTranslatedText('message.clearSearchResults') });
  expect(clearSearchButton).toBeInTheDocument();

  const replaceToggleButton = canvas.getByRole('button', { name: getTranslatedText('option.searchPanel.replaceOptions') });
  await replaceToggleButton.click();
};

SearchPanelRight.parameters = disableRtlModeParameters;

export function SearchPanelWithResults() {
  const mockSearchResults = [
    {
      ambientStr: 'This is a sample document with important text content.',
      resultStr: 'important',
      resultStrStart: 31,
      resultStrEnd: 40,
      pageNum: 1,
    },
    {
      ambientStr: 'The second page contains important data analysis results.',
      resultStr: 'important',
      resultStrStart: 25,
      resultStrEnd: 34,
      pageNum: 2,
    },
    {
      ambientStr: 'Summary of all important findings from the report.',
      resultStr: 'important',
      resultStrStart: 15,
      resultStrEnd: 24,
      pageNum: 3,
    },
  ];
  const mockDocumentViewerWithResults = {
    ...core.getDocumentViewer(),
    getPageSearchResults: () => mockSearchResults,
    getActiveSearchResult: () => undefined,
  };
  core.getDocumentViewer = () => mockDocumentViewerWithResults;
  core.getDocumentViewers = () => [mockDocumentViewerWithResults];

  const storeWithResults = configureStore({
    reducer: () => ({
      ...initialState,
      search: {
        ...initialState.search,
        value: 'important',
        status: 'SEARCH_DONE',
      },
    }),
  });

  return (
    <Provider store={storeWithResults}>
      <Panel location={'left'} dataElement={'panel'}>
        <SearchPanelContainer />
      </Panel>
    </Provider>
  );
}

SearchPanelWithResults.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const searchInput = await canvas.findByRole('textbox', { name: getTranslatedText('message.searchDocumentPlaceholder') });
  expect(searchInput).toBeInTheDocument();
  expect(searchInput).toHaveValue('important');

  const resultItems = await canvas.findAllByText(/important/i);
  expect(resultItems.length).toBeGreaterThan(0);
};

const SearchPanelInApp = (context, location, panelSize) => {
  const mockState = {
    ...mockAppInitialState,
    viewer: {
      ...mockAppInitialState.viewer,
      activeCustomRibbon: 'toolbarGroup-Insert',
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'searchPanel',
        render: 'searchPanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        searchPanel: true,
      },
      activeTheme: context.globals.theme,
      flyoutMap: {
        searchOptionsFlyout: {
          dataElement: 'searchOptionsFlyout',
          items: [],
        }
      },
      flyoutPosition: null,
      openFlyout: null,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export function SearchPanelInMobile(args, context) {
  return SearchPanelInApp(context, 'left');
}

SearchPanelInMobile.parameters = mobileStoryParameters;
