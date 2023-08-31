import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BottomHeader from 'components/ModularComponents/BottomHeader';
import initialState from 'src/redux/initialState';

export default {
  title: 'ModularComponents/FloatingHeader/BottomHeader',
  component: BottomHeader,
};

initialState.featureFlags.customizableUI = true;

const MockDocumentContainer = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      Mock Document Container
      <img src="https://placekitten.com/200/300?image=11" />
    </div>
  );
};

const MockAppWrapperWithBottomHeader = ({ initialState }) => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <MockDocumentContainer />
        <BottomHeader />
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

const defaultBottomHeader = {
  dataElement: 'defaultHeader',
  placement: 'bottom',
  gap: 20,
  items: [button1, button2, divider, button3],
};

const floatStartBottomHeader = {
  dataElement: 'floatStartBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'start',
  items: [button3, button4],
  gap: 20
};

const secondFloatStartBottomHeader = {
  dataElement: 'secondFloatStartBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'start',
  items: [button5, button6],
  gap: 20
};

const floatCenterBottomHeader = {
  dataElement: 'floatCenterBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'center',
  items: [button1, button2],
  gap: 20
};

const floatEndBottomHeader = {
  dataElement: 'floatEndBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'end',
  items: [button7, button8, divider, button9],
  gap: 20
};


export const BottomHeaderWithDefaultAndFloaties = () => {
  const stateWithDefaultAndFloaties = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        defaultBottomHeader,
        secondFloatStartBottomHeader,
        floatStartBottomHeader,
        floatCenterBottomHeader,
        floatEndBottomHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithDefaultAndFloaties} />);
};

export const FloatBottomStartHeader = () => {
  const stateWithStartFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatStartBottomHeader,
        secondFloatStartBottomHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithStartFloatHeader} />);
};

export const FloatBottomCenterHeader = () => {
  const stateWithCenterFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatCenterBottomHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithCenterFloatHeader} />);
};

export const FloatBottomEndHeader = () => {
  const stateWithEndFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatEndBottomHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithEndFloatHeader} />);
};
