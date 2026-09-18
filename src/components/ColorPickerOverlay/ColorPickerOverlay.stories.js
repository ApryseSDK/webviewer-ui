import React from 'react';
import ColorPickerOverlay from './ColorPickerOverlay';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { createStore } from 'helpers/storybookHelper';
import { disableRtlModeParameters } from 'helpers/storybookParams';
import { DEFAULT_HIGHLIGHT_COLORS } from 'constants/officeEditor';
import DataElement from 'constants/dataElement';

export default {
  title: 'Components/ColorPickerOverlay',
  component: ColorPickerOverlay,
};

const createStoreWithOpenElement = (openElement) => createStore({
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      ...initialState.viewer.openElements,
      [openElement]: true,
    },
  },
});

const BasicComponent = ({ store, children }) => {
  return (
    <Provider store={store}>
      <div data-element='textColorButton' />
      {children}
    </Provider>
  );
};

export function Basic() {
  return (
    <BasicComponent store={createStoreWithOpenElement(DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY)}>
      <ColorPickerOverlay
        onStyleChange={() => { }}
        portalElementId={'storybook-root'}
        overlayDataElement={DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY}
      />
    </BasicComponent>
  );
}

export function HighlightColorPicker() {
  return (
    <BasicComponent store={createStoreWithOpenElement(DataElement.OFFICE_EDITOR_HIGHLIGHT_COLOR_PICKER_OVERLAY)}>
      <ColorPickerOverlay
        onStyleChange={() => { }}
        onDefaultColorReset={() => { }}
        portalElementId={'storybook-root'}
        overlayDataElement={DataElement.OFFICE_EDITOR_HIGHLIGHT_COLOR_PICKER_OVERLAY}
        colorPaletteOverride={DEFAULT_HIGHLIGHT_COLORS}
      />
    </BasicComponent>
  );
}
HighlightColorPicker.parameters = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};

Basic.parameters = disableRtlModeParameters;
