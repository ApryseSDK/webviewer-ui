import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import WarningModal from './WarningModal';
import DataElements from 'constants/dataElement';

export default {
  title: 'Components/WarningModal',
  component: WarningModal,
  parameters: {
    customizableUI: true
  }
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