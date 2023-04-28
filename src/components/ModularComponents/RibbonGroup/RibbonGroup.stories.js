import React from 'react';
import RibbonGroup from './RibbonGroup';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

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
    customFlxPanels: [],
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    toolbarGroup: 'toolbarGroup-View',
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

export const ribbonGroup = () => {
  const props = {
    dataElement: 'ribbon-group',
    items: [item1, item2, item3]
  };

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <RibbonGroup {...props} />
      </div>
    </Provider>
  );
};