import React from 'react';
import GroupedItems from './GroupedItems';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mockModularComponents } from '../AppStories/mockAppState';
import {
  button1,
  button2,
} from '../Helpers/mockHeaders';

export default {
  title: 'ModularComponents/GroupedItems',
  component: GroupedItems,
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
    flyoutMap: {},
    lastPickedToolForGroupedItems: {},
    modularComponents: {
      ...mockModularComponents,
      button1,
      button2,
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};

export const Group = () => {
  const props = {
    dataElement: 'grouped-item',
    items: [button1, button2]
  };

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <GroupedItems {...props} />
      </div>
    </Provider>
  );
};