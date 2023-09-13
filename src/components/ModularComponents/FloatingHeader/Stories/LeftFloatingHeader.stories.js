import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LeftHeader from 'components/ModularComponents/LeftHeader';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';

export default {
  title: 'ModularComponents/FloatingHeader/LeftHeader',
  component: LeftHeader,
};

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
    <Provider store={configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    })}>
      <div className="content">
        <LeftHeader />
        <MockDocumentContainer />
      </div>
    </Provider>
  );
};

const baseButton = {
  dataElement: 'button',
  disabled: false,
  title: 'Button 1',
  label: 'Add',
  type: 'customButton'
};

const toggle = {
  dataElement: 'left-panel-toggle',
  toggleElement: 'leftPanel',
  disabled: false,
  title: 'Left Panel',
  img: 'icon-header-sidebar-line',
  type: 'toggleButton',
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

const defaultLeftHeader = {
  dataElement: 'defaultHeader',
  placement: 'left',
  gap: 20,
  items: [button1, button2, divider, button3],
};

const floatStartLeftHeader = {
  dataElement: 'floatStartLeftHeader',
  placement: 'left',
  float: true,
  position: 'start',
  items: [button3, button4, toggle],
  gap: 20
};

const secondFloatStartLeftHeader = {
  dataElement: 'secondFloatLeftBottomHeader',
  placement: 'left',
  float: true,
  position: 'start',
  items: [button5, button6],
  gap: 20
};

const floatCenterLeftHeader = {
  dataElement: 'floatCenterLeftHeader',
  placement: 'left',
  float: true,
  position: 'center',
  items: [button1, button2],
  gap: 20
};

const floatEndLeftHeader = {
  dataElement: 'floatEndLeftHeader',
  placement: 'left',
  float: true,
  position: 'end',
  items: [button7, button8, divider, button9],
  gap: 20
};


export const LeftHeaderWithDefaultAndFloaties = () => {
  const stateWithDefaultAndFloaties = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        defaultLeftHeader,
        secondFloatStartLeftHeader,
        floatStartLeftHeader,
        floatCenterLeftHeader,
        floatEndLeftHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithDefaultAndFloaties} />);
};

export const FloatLeftStartHeader = () => {
  const stateWithStartFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatStartLeftHeader,
        secondFloatStartLeftHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithStartFloatHeader} />);
};

export const FloatLeftCenterHeader = () => {
  const stateWithCenterFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatCenterLeftHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithCenterFloatHeader} />);
};

export const FloatLeftEndHeader = () => {
  const stateWithEndFloatHeader = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: [
        floatEndLeftHeader,
      ],
    },
  };
  return (<MockAppWrapperWithBottomHeader initialState={stateWithEndFloatHeader} />);
};
