import React from 'react';
import RibbonGroup from './RibbonGroup';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mockModularComponents } from '../AppStories/mockAppState';

export default {
  title: 'ModularComponents/RibbonGroup',
  component: RibbonGroup,
  parameters: {
    customizableUI: true,
  }
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
    activeCustomRibbon: 'Ribbon Item1',
    activeGroupedItems: [],
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    lastPickedToolForGroupedItems: {},
    customHeadersAdditionalProperties: {},
    modularComponents: mockModularComponents,
  },
  featureFlags: {
    customizableUI: true,
  },
};

const item1 = {
  dataElement: 'Ribbon Item1',
  img: 'icon-header-pan',
  title: 'icon only',
  toolbarGroup: 'toolbarGroup-View',
  type: 'ribbonItem',
};

const item2 = {
  dataElement: 'Ribbon Item2',
  label: 'label only',
  toolbarGroup: 'toolbarGroup-Annotate',
  type: 'ribbonItem',
};

const item3 = {
  dataElement: 'Ribbon Item3',
  label: 'icon and label',
  img: 'icon-header-pan',
  toolbarGroup: 'toolbarGroup-Shapes',
  type: 'ribbonItem',
};

const item4 = {
  dataElement: 'Ribbon Item4',
  label: 'Insert',
  toolbarGroup: 'toolbarGroup-Insert',
  type: 'ribbonItem',
};

const item5 = {
  dataElement: 'Ribbon Item5',
  title: 'Measure',
  'img': 'icon-tool-measurement-distance-line',
  toolbarGroup: 'toolbarGroup-Measure',
  type: 'ribbonItem',
};

const item6 = {
  dataElement: 'Ribbon Item6',
  label: 'Edit',
  toolbarGroup: 'toolbarGroup-Edit',
  type: 'ribbonItem',
};

const item7 = {
  dataElement: 'Ribbon Item7',
  label: 'Fill and Sign',
  toolbarGroup: 'toolbarGroup-FillAndSign',
  type: 'ribbonItem',
};

const item8 = {
  dataElement: 'Ribbon Item8',
  label: 'Forms',
  toolbarGroup: 'toolbarGroup-Forms',
  type: 'ribbonItem',
};

const store = configureStore({
  reducer: () => initialState,
});

export const ribbonGroupFull = () => {
  // Removing toolbarGroup for match the testing output
  // And avoiding re-creating test objects without toolbarGroup
  const temp1 = Object.assign({}, item1, { toolbarGroup: null });
  const temp2 = Object.assign({}, item2, { toolbarGroup: null });
  const temp3 = Object.assign({}, item3, { toolbarGroup: null });
  const temp4 = Object.assign({}, item4, { toolbarGroup: null });
  const temp5 = Object.assign({}, item5, { toolbarGroup: null });

  const props = {
    dataElement: 'ribbon-group',
    headerDirection: 'row',
    items: [temp1, temp2, temp3, temp4, temp5, item6, item7, item8],
  };

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
      'ribbon-group': 3
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

  return (
    <Provider store={storeDropdown}>
      <div style={{ display: 'flex', maxWidth: '10%' }}>
        <RibbonGroup {...props} />
      </div>
    </Provider>
  );
};