import React, { useEffect } from 'react';
import SearchPanelContainer from './SearchPanelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import { default as mockAppInitialState } from 'src/redux/initialState';

export default {
  title: 'ModularComponents/SearchPanel',
  component: SearchPanelContainer,
  parameters: {
    customizableUI: true,
  },
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
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'right'} dataElement={'panel'}>
        <SearchPanelContainer />
      </Panel>
    </Provider>
  );
}

const SearchPanelInApp = (location, panelSize) => {
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
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export function SearchPanelInMobile() {
  return SearchPanelInApp('left');
}

SearchPanelInMobile.parameters = window.storybook.MobileParameters;