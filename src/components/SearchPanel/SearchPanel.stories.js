import React from 'react';
import SearchPanel from './SearchPanelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';

export default {
  title: 'ModularComponents/SearchPanel',
  component: SearchPanel
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
};

const store = configureStore({ reducer: () => initialState });

export function SearchPanelLeft() {
  return (
    <Provider store={store}>
      <Panel location={'left'} dataElement={'panel'}>
        <SearchPanel />
      </Panel>
    </Provider>
  );
}

export function SearchPanelRight() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'right'} dataElement={'panel'}>
        <SearchPanel />
      </Panel>
    </Provider>
  );
}
