import React from 'react';
import RibbonOverflowFlyout from './RibbonOverflowFlyout';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from '../Flyout/Flyout';

export default {
  title: 'ModularComponents/RibbonGroup',
  component: RibbonOverflowFlyout,
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
  label: 'label only 2',
  toolbarGroup: 'toolbarGroup-Shapes',
  type: 'ribbonItem',
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    customFlxPanels: [],
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
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    toolbarGroup: 'toolbarGroup-View',
    modularHeaders: [],
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40
    },
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
        modularHeaders: [],
        modularHeadersHeight: {
          topHeaders: 40,
          bottomHeaders: 40
        },
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
