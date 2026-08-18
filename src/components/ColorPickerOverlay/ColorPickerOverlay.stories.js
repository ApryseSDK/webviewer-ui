import React from 'react';
import ColorPickerOverlay from './ColorPickerOverlay';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';
import { disableRtlModeParameters } from 'helpers/storybookParams';
import DataElement from 'constants/dataElement';

export default {
  title: 'Components/ColorPickerOverlay',
  component: ColorPickerOverlay,
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
  store.getState().viewer.openElements[DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY] = true;
  return (
    <BasicComponent>
      <ColorPickerOverlay
        onStyleChange={() => { }}
        portalElementId={'storybook-root'}
        overlayDataElement={DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY}
      />
    </BasicComponent>
  );
}

Basic.parameters = disableRtlModeParameters;
