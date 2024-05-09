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
    disabledElements: {
      logoBar: { disabled: true },
    },
    openElements: {
      panel: true,
      header: true
    },
    panelWidths: { panel: DEFAULT_NOTES_PANEL_WIDTH },
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
    modularHeaders: {}
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
  initialState.viewer.openElements.panel2 = true;
  const store = configureStore({ reducer: () => initialState });
  return (
    <Provider store={store}>
      <Panel dataElement="panel2" location="right">
        <div>FooBar on the right</div>
      </Panel>
    </Provider>
  );
}

// Should not be cutoff
export function PanelWithHeaders() {
  const state = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      panelCustomEmptyPanel: undefined,
      openElements: {
        panel: true,
        panel2: true,
      },
      isMultiTab: true,
      tabs: [],
      genericPanels: [],
      modularHeadersHeight: {
        top: 49,
      },
      floatingContainersDimensions: {},
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = configureStore({ reducer: () => state });
  return (
    <Provider store={store}>
      <div>
        <div style={{ width: '100%', height: '33px', backgroundColor: 'black' }}>SIZE OF MULTI-TAB HEADER</div>
        <div style={{ width: '100%', height: '49px', backgroundColor: 'darkgray' }}>SIZE OF TOP HEADER</div>
        <div style={{ width: '100%', height: '49px', backgroundColor: 'black' }}>SIZE OF TOOLS HEADER</div>
        <Panel dataElement="panel" location="right">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100%' }}>
            <div>This text should not be cutoff</div>
            <div>This text should not be cutoff</div>
          </div>
        </Panel>
        <Panel dataElement="panel2" location="left">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100%' }}>
            <div>This text should not be cutoff</div>
            <div>This text should not be cutoff</div>
          </div>
        </Panel>
      </div>
    </Provider>
  );
}
