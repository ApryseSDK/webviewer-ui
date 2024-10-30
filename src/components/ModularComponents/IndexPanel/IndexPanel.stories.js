/* eslint-disable no-unsanitized/property */
import React from 'react';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';
import IndexPanelContainer from './IndexPanelContainer';
import IndexPanel from './IndexPanel';
import { widgets } from './helper';

export default {
  title: 'ModularComponents/IndexPanel',
  component: IndexPanelContainer,
  parameters: {
    customizableUI: true,
  }
};

const mockState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    isInDesktopOnlyMode: false,
    genericPanels: [{
      dataElement: 'indexPanel',
      render: 'indexPanel',
      location: location,
    }],
    openElements: {
      ...initialState.viewer.openElements,
      indexPanel: true,
      panel: true,
      contextMenuPopup: false,
    },
    activeDocumentViewerKey: 1,
    activeGroupedItems: ['formsGroupedItems'],
    activeCustomRibbon: 'toolbarGroup-Forms',
    activeToolName: 'TextFormFieldCreateTool',
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
      'toolbarGroup-EditText': { disabled: true },
      'toolbarGroup-Measure': { disabled: true },
      'toolbarGroup-Redact': { disabled: true },
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};

export function Basic() {
  const store = configureStore({ reducer: () => mockState });
  return (
    <div className='Panel LeftPanel' style={{ width: '400px', minWidth: '400px', height: '100%' }}>
      <div className='left-panel-container' style={{ minWidth: '400px', height: '100%' }}>
        <Provider store={store}>
          <IndexPanelContainer dataElement="indexPanel" />
        </Provider>
      </div></div>
  );
}

export function WithWidgets() {
  const store = configureStore({ reducer: () => mockState });
  return (
    <div className='Panel LeftPanel' style={{ width: '400px', minWidth: '400px', height: '100%' }}>
      <div className='left-panel-container' style={{ minWidth: '400px', height: '100%' }}>
        <Provider store={store}>
          <IndexPanel dataElement="indexPanel" widgets={widgets}/>
        </Provider>
      </div></div>
  );
}

const IndexPanelInApp = (location) => {
  mockState.viewer.genericPanels[0].location = location;
  const store = createStore(mockState);
  setItemToFlyoutStore(store);
  return <MockApp initialState={mockState} />;
};

export const IndexPanelInMobile = () => IndexPanelInApp();
IndexPanelInMobile.parameters = window.storybook?.MobileParameters;