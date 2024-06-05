import React from 'react';
import ToggleElementButton from './ToggleElementButton';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'ModularComponents/ToggleElementButton',
  component: ToggleElementButton,
  parameters: {
    customizableUI: true,
  },
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      signatureModal: false
    },
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
    genericPanels: [],
    lastPickedToolGroup: '',
  },
};
const initialStateActive = {
  viewer: {
    ...initialState.viewer,
    openElements: {
      signatureModal: true,
    },
  },
};

const store = configureStore({
  reducer: (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'OPEN_ELEMENT':
        return initialStateActive;
      default:
        return initialState;
    }
  }
});

export const ToggleElementButtonComponent = () => (
  <Provider store={store}>
    <ToggleElementButton img='icon-header-search' toggleElement='signatureModal' dataElement='toggleButton' />
  </Provider>
);

export const ToggleElementButtonWithLabelOnHoverState = () => (
  <Provider store={store}>
    <ToggleElementButton img='icon-header-search' toggleElement='signatureModal' dataElement='toggleButton' label='Toggle Element' />
  </Provider>
);

ToggleElementButtonWithLabelOnHoverState.parameters = {
  pseudo: { hover: true },
};
