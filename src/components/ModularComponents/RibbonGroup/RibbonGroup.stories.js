import React from 'react';
import RibbonGroup from './RibbonGroup';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mockModularComponents } from '../AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';

export default {
  title: 'ModularComponents/RibbonGroup',
  component: RibbonGroup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    genericPanels: [],
    flyoutMap: {},
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    activeCustomRibbon: 'toolbarGroup-View',
    activeGroupedItems: [],
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    lastPickedToolForGroupedItems: {},
    lastActiveToolForRibbon: {},
    customHeadersAdditionalProperties: {},
    modularComponents: mockModularComponents,
  },
  featureFlags: {
    customizableUI: true,
  },
};

const item1 = {
  dataElement: 'toolbarGroup-View',
  img: 'icon-header-pan',
  title: 'icon only',
  toolbarGroup: 'toolbarGroup-View',
  type: 'ribbonItem',
};

const item2 = {
  dataElement: 'toolbarGroup-Annotate',
  label: 'label only',
  toolbarGroup: 'toolbarGroup-Annotate',
  type: 'ribbonItem',
};

const item3 = {
  dataElement: 'toolbarGroup-Shapes',
  label: 'icon and label',
  img: 'icon-header-pan',
  toolbarGroup: 'toolbarGroup-Shapes',
  type: 'ribbonItem',
};

const item4 = {
  dataElement: 'toolbarGroup-Measure',
  title: 'Measure',
  'img': 'icon-tool-measurement-distance-line',
  toolbarGroup: 'toolbarGroup-Measure',
  type: 'ribbonItem',
};

const store = configureStore({
  reducer: () => initialState,
});

export const RibbonGroupFull = () => {
  // Removing toolbarGroup for match the testing output
  // And avoiding re-creating test objects without toolbarGroup
  const temp1 = { ...item1, toolbarGroup: null };
  const temp2 = { ...item2, toolbarGroup: null };
  const temp3 = { ...item3, toolbarGroup: null };
  const temp4 = { ...mockModularComponents['toolbarGroup-Insert'],  toolbarGroup: null };
  const temp5 = { ...item4, toolbarGroup: null };
  const temp6 = { ...mockModularComponents['toolbarGroup-Edit'],  toolbarGroup: null };
  const temp7 = { ...mockModularComponents['toolbarGroup-FillAndSign'],  toolbarGroup: null };
  const temp8 = { ...mockModularComponents['toolbarGroup-Forms'],  toolbarGroup: null };

  const props = {
    dataElement: 'ribbon-group',
    headerDirection: 'row',
    items: [temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8],
  };

  setItemToFlyoutStore(store);

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', maxWidth: '100%' }}>
        <RibbonGroup {...props} />
      </div>
    </Provider>
  );
};

export const RibbonGroupSingleItem = () => {
  const temp1 = { ...item3, toolbarGroup: null };
  const props = {
    dataElement: 'ribbon-group',
    headerDirection: 'row',
    items: [temp1],
  };

  setItemToFlyoutStore(store);

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', maxWidth: '100%' }}>
        <RibbonGroup {...props} />
      </div>
    </Provider>
  );
};

const initialStateDropdown = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    customElementSizes: {
      'ribbon-group': 2,
    },
    activeGroupedItems: [],
    activeCustomRibbon: 'toolbarGroup-View',
    modularComponents: mockModularComponents,
  }
};

const storeDropdown = configureStore({
  reducer: () => initialStateDropdown
});


export const ribbonGroupDropdown = () => {
  const props = {
    dataElement: 'ribbon-group',
    headerDirection: 'row',
    items: [item1, item2, item3],
  };

  setItemToFlyoutStore(storeDropdown);

  return (
    <Provider store={storeDropdown}>
      <div style={{ display: 'flex', maxWidth: '10%' }}>
        <RibbonGroup {...props} />
      </div>
    </Provider>
  );
};