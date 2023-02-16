import React from 'react';
import ModularHeader from './ModularHeader';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ALIGNMENT } from 'src/constants/customizationVariables';

export default {
  title: 'ModularComponents/ModularHeader',
  component: ModularHeader,
  argTypes: {
    alignment: {
      options: Object.values(ALIGNMENT),
      control: { type: 'select' },
    },
  },
};

const initialState = {
  viewer: {
    modularHeaders: [],
    customElementOverrides: {},
    disabledElements: []
  },
};

const MockDocumentContainer = () => {
  return (
    <div style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Mock Document Container
    </div>
  );
};

const baseButton = {
  dataElement: 'button',
  onClick: () => alert('Added'),
  disabled: false,
  title: 'Button 1',
  label: 'Add',
  type: 'customButton'
};

const button1 = { ...baseButton, dataElement: 'button1', label: 'Button 1' };
const button2 = { ...baseButton, dataElement: 'button2', label: 'Button 2' };
const button3 = { ...baseButton, dataElement: 'button3', label: 'Button 3' };
const button4 = { ...baseButton, dataElement: 'button4', label: 'Button 4' };
const button5 = { ...baseButton, dataElement: 'button5', label: 'Button 5' };
const button6 = { ...baseButton, dataElement: 'button6', label: 'Button 6' };
const button7 = { ...baseButton, dataElement: 'button7', label: 'Button 7' };
const button8 = { ...baseButton, dataElement: 'button8', label: 'Button 8' };
const button9 = { ...baseButton, dataElement: 'button9', label: 'Button 9' };


export const TopHeader = (storyProps) => {
  const props = {
    dataElement: 'defaultHeader',
    placement: 'top',
    gap: 20,
    items: [button1, button2],
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
    items: [button3, button4, button5, button6],
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
    items: [button7, button8, button9],
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
    items: [button8, button9],
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