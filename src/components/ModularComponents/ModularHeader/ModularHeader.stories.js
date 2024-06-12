import React from 'react';
import ModularHeader from './ModularHeader';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { JUSTIFY_CONTENT } from 'src/constants/customizationVariables';
import {
  button1,
  button2,
  button3,
  button4,
  button5,
  button6,
  button7,
  button8,
  button9,
} from '../Helpers/mockHeaders';
import { mockModularComponents } from '../AppStories/mockAppState';
import '../LeftHeader/LeftHeader.scss';
import '../RightHeader/RightHeader.scss';

export default {
  title: 'ModularComponents/ModularHeader',
  component: ModularHeader,
  argTypes: {
    justifyContent: {
      options: Object.values(JUSTIFY_CONTENT),
      control: { type: 'select' },
    },
  },
  parameters: {
    customizableUI: true,
  },
};

const initialState = {
  viewer: {
    modularHeaders: {},
    customElementOverrides: {},
    disabledElements: [],
    openElements: {},
    customPanels: [],
    flyoutMap: {},
    lastPickedToolForGroupedItems: {},
    modularComponents: {
      ...mockModularComponents,
      button8,
      button9,
    },
  },
};

const MockDocumentContainer = () => {
  return (
    <div style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Mock Document Container
    </div>
  );
};

const divider = {
  type: 'divider',
  dataElement: 'divider-1',
};

const group1 = {
  dataElement: 'group1',
  items: [button8, button9],
  gap: 100,
  grow: 1,
  justifyContent: 'center',
  alwaysVisible: true,
  type: 'groupedItems'
};

export const TopHeader = (storyProps) => {
  const props = {
    dataElement: 'defaultHeader',
    placement: 'top',
    gap: 20,
    items: [button1, button2, divider, button3, group1],
    ...storyProps,
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ModularHeader {...props} />
        <MockDocumentContainer />
      </div>
    </Provider>
  );
};

export const LeftHeader = (storyProps) => {
  const props = {
    dataElement: 'leftHeader',
    placement: 'left',
    items: [button3, button4, divider, button5, button6],
    ...storyProps,
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', height: '100%' }}>
        <ModularHeader {...props} />
        <MockDocumentContainer />
      </div>
    </Provider>
  );
};

export const RightHeader = (storyProps) => {
  const props = {
    dataElement: 'rightHeader',
    placement: 'right',
    gap: 20,
    items: [button7, divider, button8, button9, group1],
    ...storyProps,
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', height: '100%' }}>
        <MockDocumentContainer />
        <ModularHeader {...props} />
      </div>
    </Provider>
  );
};

export const BottomHeader = (storyProps) => {
  const props = {
    dataElement: 'bottomHeader',
    placement: 'bottom',
    gap: 20,
    items: [button8, divider, button9],
    ...storyProps,
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MockDocumentContainer />
        <ModularHeader {...props} />
      </div>
    </Provider>
  );
};