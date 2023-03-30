import React from 'react';
import ColorPickerOverlay from './ColorPickerOverlay';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'Components/ColorPickerOverlay',
  component: ColorPickerOverlay,
};

const store = configureStore({ reducer: () => initialState });

const BasicComponent = ({ children }) => {
  return (
    <Provider store={store}>
      <div data-element="textColorButton" />
      {children}
    </Provider>
  );
};

export function Basic() {
  store.getState().viewer.openElements.colorPickerOverlay = true;
  return (
    <BasicComponent>
      <ColorPickerOverlay onStyleChange={() => {}} portalElementId={'root'} />
    </BasicComponent>
  );
}