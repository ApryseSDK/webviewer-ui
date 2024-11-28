import React from 'react';
import ColorPickerOverlay from './ColorPickerOverlay';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'Components/ColorPickerOverlay',
  component: ColorPickerOverlay,
  parameters: {
    customizableUI: true
  }
};

const store = configureStore({ reducer: () => initialState });

const BasicComponent = ({ children }) => {
  return (
    <Provider store={store}>
      <div data-element='textColorButton' />
      {children}
    </Provider>
  );
};

export function Basic() {
  store.getState().viewer.openElements.officeEditorColorPickerOverlay = true;
  return (
    <BasicComponent>
      <ColorPickerOverlay onStyleChange={() => { }} portalElementId={'storybook-root'} />
    </BasicComponent>
  );
}