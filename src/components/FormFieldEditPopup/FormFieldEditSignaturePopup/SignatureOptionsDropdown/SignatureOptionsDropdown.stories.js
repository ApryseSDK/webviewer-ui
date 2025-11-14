import React from 'react';
import SignatureOptionsDropdown from './SignatureOptionsDropdown';
import { configureStore } from '@reduxjs/toolkit';


import { Provider } from 'react-redux';


export default {
  title: 'Components/FormFieldEditPanel',
  component: SignatureOptionsDropdown,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
  featureFlags: {
    customizableUI: true,
  },
};

const store = configureStore({ reducer: () => initialState });

export function SignatureOptions() {
  const props = {
    onChangeHandler: () => {},
    initialOption: 'Signature',
  };
  return (
    <Provider store={store}>
      <div className="FormFieldPanel">
        <SignatureOptionsDropdown {...props} />
      </div>
    </Provider>
  );
}

SignatureOptions.parameters = window.storybook.disableRtlMode;
