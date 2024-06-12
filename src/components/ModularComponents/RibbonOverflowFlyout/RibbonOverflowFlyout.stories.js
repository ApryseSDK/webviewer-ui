import React from 'react';
import RibbonOverflowFlyout from './RibbonOverflowFlyout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from '../Flyout/Flyout';

export default {
  title: 'ModularComponents/RibbonGroup',
  component: RibbonOverflowFlyout,
  parameters: {
    customizableUI: true,
  },
};

const item1 = {
  dataElement: 'Ribbon Item1',
  img: 'icon-header-pan',
  title: 'icon only',
  type: 'ribbonItem',
};

const item2 = {
  dataElement: 'Ribbon Item2',
  label: 'label only',
  type: 'ribbonItem',
};

const item3 = {
  dataElement: 'Ribbon Item3',
  label: 'icon and label',
  img: 'icon-header-pan',
  type: 'ribbonItem',
};

const item4 = {
  dataElement: 'Ribbon Item4',
  label: 'label only 2',
  type: 'ribbonItem',
};

const initialState = {
  viewer: {
    modularComponents: {},
    customHeadersAdditionalProperties: {},
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    genericPanels: [],
    flyoutMap: {
      'RibbonOverflowFlyout': {
        'dataElement': 'RibbonOverflowFlyout',
        className: 'RibbonOverflowFlyout',
        items: [item1, item2, item3],
      },
      'RibbonOverflowFlyoutNoIcons': {
        'dataElement': 'RibbonOverflowFlyoutNoIcons',
        className: 'RibbonOverflowFlyoutNoIcons',
        items: [item2, item4],
      }
    },
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout: 'RibbonOverflowFlyout',
    activeCustomPanel: '',
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    toolbarGroup: 'toolbarGroup-View',
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
    activeCustomRibbon: 'Ribbon Item1',
    lastPickedToolForGroupedItems: {},
  },
};

const store = configureStore({
  reducer: () => initialState,
});

export const OverflowFlyout = (props) => {
  return (
    <Provider store={store}>
      <Flyout {...props} className={'overFlowFlyout'} />
    </Provider>
  );
};

const noIconsStore = configureStore({
  reducer: () => {
    return {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        activeFlyout: 'RibbonOverflowFlyoutNoIcons',
        activeCustomPanel: '',
        modularHeaders: {},
        modularHeadersHeight: {
          topHeaders: 40,
          bottomHeaders: 40
        },
        customHeadersAdditionalProperties: {},
      }
    };
  }
});

export const NoIconsOverflowFlyout = (props) => {
  return (
    <Provider store={noIconsStore}>
      <Flyout {...props} className={'overflowFlyout'} />
    </Provider>
  );
};
