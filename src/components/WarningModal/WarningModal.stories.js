import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import WarningModal from './WarningModal';
import actions from 'actions';
import rootReducer from 'reducers/rootReducer';
import DataElements from 'constants/dataElement';
import { within, expect } from 'storybook/test';


export default {
  title: 'Components/WarningModal',
  component: WarningModal,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      [DataElements.WARNING_MODAL]: true
    },
    warning: {
      title: 'Warning title',
      message: 'This is a warning message',
    }
  },
  featureFlags: {
    customizableUI: true,
  },
};

const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <WarningModal />
    </Provider>
  );
};

export const DefaultWarningModal = Basic;
export const DefaultWarningModalMobile = Basic;
DefaultWarningModalMobile.parameters = window.storybook?.MobileParameters;

const store = configureStore({ reducer: rootReducer });

export const SecondaryButtonModal = () => {
  return (
    <Provider store={store}>
      <WarningModal />
    </Provider>
  );
};

SecondaryButtonModal.play = async ({ canvasElement }) => {
  store.dispatch(actions.showWarningMessage({
    title: 'FIRST MODAL',
    message: 'FIRST MODAL message',
    confirmBtnText: 'FIRST MODAL Confirm',
    secondaryBtnText: 'FIRST MODAL Secondary',
    onSecondary: () => { },
  }));

  const canvas = within(canvasElement);
  const secondaryBtn = canvas.getByRole('button', { name: 'FIRST MODAL Secondary' });
  expect(secondaryBtn).toBeInTheDocument();

  store.dispatch(actions.showWarningMessage({
    title: 'SECOND MODAL',
    message: 'SECOND MODAL message',
    confirmBtnText: 'SECOND MODAL Confirm',
  }));

  expect(secondaryBtn).not.toBeInTheDocument();
};

SecondaryButtonModal.parameters = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};