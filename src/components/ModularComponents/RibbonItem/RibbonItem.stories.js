import React from 'react';
import RibbonItem from './RibbonItem';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'ModularComponents/RibbonItem',
  component: RibbonItem,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    customFlxPanels: [],
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    toolbarGroup: 'toolbarGroup-View',
  },
};

const initialStateActive = (toolbarGroup) => {
  return ({
    viewer: {
      ...initialState.viewer,
      toolbarGroup: toolbarGroup
    }
  });
};

const store = configureStore({
  reducer: (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'SET_TOOLBAR_GROUP':
        return initialStateActive(payload.toolbarGroup);
      default:
        return initialState;
    }
  }
});

export const RibbonItems = () => {
  const item1Props = {
    dataElement: 'Ribbon Item1',
    img: 'icon-header-pan',
    title: 'icon only',
    toolbarGroup: 'toolbarGroup-View'
  };
  const item2Props = {
    dataElement: 'Ribbon Item2',
    label: 'label only',
    toolbarGroup: 'toolbarGroup-Annotate'
  };
  const item3Props = {
    dataElement: 'Ribbon Item3',
    label: 'icon and label',
    img: 'icon-header-pan',
    toolbarGroup: 'toolbarGroup-Shapes'
  };
  return (
    <Provider store={store}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <RibbonItem {...item1Props} />
        <RibbonItem {...item2Props} />
        <RibbonItem {...item3Props} />
      </div>
    </Provider>
  );
};
