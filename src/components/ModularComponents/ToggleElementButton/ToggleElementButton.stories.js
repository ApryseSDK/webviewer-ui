import React from 'react';
import ToggleElementButton from './ToggleElementButton';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { panelData } from 'src/constants/panel';
import PropTypes from 'prop-types';
import { expect, within } from '@storybook/test';

export default {
  title: 'ModularComponents/ToggleElementButton',
  component: ToggleElementButton,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      signatureModal: false,
      testFlyout: false,
    },
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
    genericPanels: [],
    lastPickedToolGroup: '',
    flyoutMap: {
      testFlyout: {}
    },
    activeFlyout: null,
  },
  featureFlags: {
    customizableUI: true
  },
};
const initialStateActive = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      signatureModal: true,
      testFlyout: true,
    },
    activeFlyout: 'testFlyout',
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
    <ToggleElementButton img='icon-header-search' toggleElement='signatureModal' dataElement='toggleButton' label='Toggle Element' className='custom-class' />
  </Provider>
);
ToggleElementButtonWithLabelOnHoverState.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: /Toggle Element/i });
  expect(button.classList.contains('custom-class')).toBe(true);
};

ToggleElementButtonWithLabelOnHoverState.parameters = {
  pseudo: { hover: true },
};

const togglePanelButtons = Object.keys(panelData).map((panel) => ({
  img: panelData[panel].icon,
  toggleElement: 'signatureModal',
  dateElement: 'toggleButton',
}));

export const TogglePanelButtons = () => (
  <Provider store={store}>
    {togglePanelButtons.map((props) => (
      <div key={props.dataElement}>
        <ToggleElementButton {...props} />
      </div>
    ))}
  </Provider>
);

TogglePanelButtons.propTypes = {
  dataElement: PropTypes.string,
};

const activeStore = configureStore({ reducer: () => initialStateActive });

export const ToggleFlyoutButtonActive = () => (
  <Provider store={activeStore}>
    <ToggleElementButton img="icon-header-search" toggleElement="testFlyout" dataElement="toggleButton"/>
  </Provider>
);
ToggleFlyoutButtonActive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button');
  await expect(button.ariaPressed).toBe(null);
  await expect(button.ariaExpanded).toBe('true');
};