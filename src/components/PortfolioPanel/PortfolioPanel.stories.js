import React from 'react';
import PortfolioPanel from './PortfolioPanel';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import initialState from 'src/redux/initialState';

export default {
  title: 'ModularComponents/PortfolioPanel',
  component: PortfolioPanel,
  parameters: {
    customizableUI: true,
  },
};

const mockInitialState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    activeCustomRibbon: 'toolbarGroup-Insert',
    modularHeaders: mockHeadersNormalized,
    modularComponents: mockModularComponents,
    isInDesktopOnlyMode: false,
    openElements: {
      ...initialState.viewer.openElements,
      contextMenuPopup: false,
      portfolioPanel: true,
      panel: true,
    },
    lastPickedToolForGroupedItems: {
    },
    panelWidths: { panel: 300 },
    activeGroupedItems: ['insertGroupedItems'],
    activeCustomPanel: 'portfolioPanel',
  },
  featureFlags: {
    customizableUI: true,
  },
};

const store = configureStore({ reducer: () => mockInitialState });

export function PortfolioPanelLeft() {
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <PortfolioPanel />
      </Panel>
    </Provider>
  );
}

export function PortfolioPanelRight() {
  return (
    <Provider store={store}>
      <Panel location={'right'} dataElement={'panel'}>
        <PortfolioPanel />
      </Panel>
    </Provider>
  );
}