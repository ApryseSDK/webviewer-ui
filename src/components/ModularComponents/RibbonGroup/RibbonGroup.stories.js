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
  type: 'ribbonItem',
};

const item2 = {
  dataElement: 'toolbarGroup-Annotate',
  label: 'label only',
  type: 'ribbonItem',
};

const item3 = {
  dataElement: 'toolbarGroup-Shapes',
  label: 'icon and label',
  img: 'icon-header-pan',
  type: 'ribbonItem',
};

const item4 = { ...mockModularComponents['toolbarGroup-Insert'] };

// no label only icon
const item5 = {
  dataElement: 'toolbarGroup-Measure',
  title: 'Measure',
  'img': 'icon-tool-measurement-distance-line',
  toolbarGroup: 'toolbarGroup-Measure',
  type: 'ribbonItem',
};

const item6 = { ...mockModularComponents['toolbarGroup-Edit'] };
const item7 = { ...mockModularComponents['toolbarGroup-FillAndSign'] };
const item8 = { ...mockModularComponents['toolbarGroup-Forms'] };

const store = configureStore({
  reducer: () => initialState,
});

export const RibbonGroupFull = () => {

  const props = {
    dataElement: 'ribbon-group',
    headerDirection: 'row',
    items: [item1, item2, item3, item4, item5, item6, item7, item8],
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