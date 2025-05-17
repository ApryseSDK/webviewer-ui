import React, { useEffect } from 'react';
import SearchPanelContainer from './SearchPanelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { default as mockAppInitialState } from 'src/redux/initialState';
import { within, expect } from '@storybook/test';

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
    pageLabels: [1,2,3],
  },
  search: {},
  featureFlags: {
    customizableUI: true
  }
};

const store = configureStore({ reducer: () => initialState });

export function SearchPanelLeft() {

  useEffect(() => {
    // test focus style for a11y
    const div = document.querySelector('.ui__choice__input__check ');
    div.classList.add('ui__choice__input__check--focus');
  }, []);
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <SearchPanelContainer />
      </Panel>
    </Provider>
  );
}

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
  const searchInput = await canvas.findByRole('textbox', { name: 'Search document' });
  expect(searchInput).toBeInTheDocument();
  const clearSearchButton = await canvas.findByRole('button', { name: 'Clear search results' });
  expect(clearSearchButton).toBeInTheDocument();
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

SearchPanelInMobile.parameters = window.storybook.MobileParameters;