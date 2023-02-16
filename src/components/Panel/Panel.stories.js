import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Panel from './Panel';

export default {
  title: 'Components/Panel',
  component: Panel,
};

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const DEFAULT_NOTES_PANEL_WIDTH = 293;

const initialState = {
  viewer: {
    customElementOverrides: {},
    disabledElements: {},
    openElements: {
      panel: true,
      header: true
    },
    panelWidths: { panel: DEFAULT_NOTES_PANEL_WIDTH },
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
  }
};

export function Basic() {
  initialState.viewer.panelCustomEmptyPanel = undefined;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <Panel dataElement="panel" location="left">
        <div>FooBar</div>
      </Panel>
    </Provider>
  );
}

export function PanelOnRightSide() {
  initialState.viewer.panelCustomEmptyPanel = undefined;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <Panel dataElement="panel2" location="right">
        <div>FooBar on the right</div>
      </Panel>
    </Provider>
  );
}
