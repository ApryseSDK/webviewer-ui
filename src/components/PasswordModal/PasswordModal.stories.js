import React from 'react';
import PasswordModalComponent from './PasswordModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export default {
  title: 'Components/PasswordModal',
  component: PasswordModal,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      passwordModal: true
    },
    isMultiTab: false,
    customPanels: []
  },
  document: {
    maxPasswordAttempts: 3,
    passwordAttempts: 0,
  },
  featureFlags: {
    customizableUI: false,
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const PasswordModal = () => (
  <Provider store={store}>
    <div>
      <PasswordModalComponent />
    </div>
  </Provider>
);

const failedAttemptState = { ...initialState,
  document: {
    maxPasswordAttempts: 3,
    passwordAttempts: 1,
  }
};

const attemptFailedStore = configureStore({
  reducer: () => failedAttemptState
});

export const PasswordFailedAttemptModal = () => (
  <Provider store={attemptFailedStore}>
    <PasswordModalComponent />
  </Provider>
);

const userExceedsMaxAttemptsState = { ...initialState,
  document: {
    maxPasswordAttempts: 3,
    passwordAttempts: 3,
  }
};

const userExceedsMaxAttemptsStore = configureStore({
  reducer: () => userExceedsMaxAttemptsState
});

export const PasswordManyAttemptsErrorModal = () => (
  <Provider store={userExceedsMaxAttemptsStore}>
    <div>
      <PasswordModalComponent />
    </div>
  </Provider>
);