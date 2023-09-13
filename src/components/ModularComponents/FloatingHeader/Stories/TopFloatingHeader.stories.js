import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TopHeader from 'components/ModularComponents/TopHeader';
import initialState from 'src/redux/initialState';

export default {
  title: 'ModularComponents/FloatingHeader/TopHeader',
  component: TopHeader,
};

initialState.featureFlags.modularHeader = true;

const MockDocumentContainer = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <img src="https://placekitten.com/200/300?image=11" />
      Mock Document Container
    </div>
  );
};

const MockAppWrapperWithTopheader = ({ initialState }) => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <TopHeader />
        <MockDocumentContainer />
      </div>
    </Provider>
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

const divider = {
  type: 'divider',
  dataElement: 'divider-1',
};

// Handy mock buttons
const button1 = { ...baseButton, dataElement: 'button1', label: 'Button 1' };
const button2 = { ...baseButton, dataElement: 'button2', label: 'Button 2' };
const button3 = { ...baseButton, dataElement: 'button3', label: 'Button 3' };
const button4 = { ...baseButton, dataElement: 'button4', label: 'Button 4' };
const button5 = { ...baseButton, dataElement: 'button5', label: 'Button 5' };
const button6 = { ...baseButton, dataElement: 'button6', label: 'Button 6' };
const button7 = { ...baseButton, dataElement: 'button7', label: 'Button 7' };
const button8 = { ...baseButton, dataElement: 'button8', label: 'Button 8' };
const button9 = { ...baseButton, dataElement: 'button9', label: 'Button 9' };

// These are our headers
const defaultTopHeader = {
  dataElement: 'defaultHeader',
  placement: 'top',
  gap: 20,
  items: [button1, button2, divider, button3],
};

const floatStartHeader = {
  dataElement: 'floatStartHeader',
  placement: 'top',
  float: true,
  position: 'start',
  items: [button1, button2],
  gap: 20
};

const secondFloatStartHeader = {
  dataElement: 'floatStartHeader-2',
  placement: 'top',
  float: true,
  position: 'start',
  items: [button3, button4],
  gap: 20
};

const floatCenterHeader = {
  dataElement: 'floatCenterHeader',
  placement: 'top',
  float: true,
  position: 'center',
  items: [button5, divider, button6],
  gap: 20
};

const floatEndHeader = {
  dataElement: 'floatEndHeader',
  placement: 'top',
  float: true,
  position: 'end',
  items: [button7, divider, button8, button9],
  gap: 20
};

export const TopHeaderWithDefaultAndFloaties = () => {
  const stateWithTopHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        defaultTopHeader,
        floatStartHeader,
        secondFloatStartHeader,
        floatCenterHeader,
        floatEndHeader,
      ],
    },
  };
  return (<MockAppWrapperWithTopheader initialState={stateWithTopHeader} />);
};

export const FloatTopStartHeader = () => {
  const stateWithStartFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatStartHeader,
        secondFloatStartHeader,
      ],
    },
  };
  return (<MockAppWrapperWithTopheader initialState={stateWithStartFloatHeader} />);
};

export const FloatTopCenterHeader = () => {
  const stateWithCenterFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatCenterHeader,
      ],
    },
  };
  return (<MockAppWrapperWithTopheader initialState={stateWithCenterFloatHeader} />);
};

export const FloatTopEndHeader = () => {
  const stateWithEndFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatEndHeader,
      ],
    },
  };
  return (<MockAppWrapperWithTopheader initialState={stateWithEndFloatHeader} />);
};
