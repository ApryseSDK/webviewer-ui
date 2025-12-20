import React from 'react';
import MobilePopupWrapper from './MobilePopupWrapper';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'Components/MobilePopupWrapper',
  component: MobilePopupWrapper,
};

export function Basic() {
  const initialState = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      openElements: {},
    },
    featureFlags: {
      customizableUI: true
    }
  };

  const store = configureStore({
    reducer: () => initialState
  });

  return (
    <Provider store={store}>
      <div
        style={{
          height: '400px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
        data-testid="container"
      >
        <MobilePopupWrapper>
          <div style={{ padding: '20px', color: 'var(--text-color)' }}>
            <p>Test Content</p>
          </div>
        </MobilePopupWrapper>
      </div>
    </Provider>
  );
}

Basic.parameters = {
  viewport: {
    defaultViewport: 'Mobile',
  },
};
