import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import LogoBar from './LogoBar';

import { Provider } from 'react-redux';

export default {
  title: 'Components/LogoBar',
  component: LogoBar,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
};

const store = configureStore({
  reducer: () => initialState
});

export const LogoBarComponent = () => (
  <Provider store={store}>
    <div style={{ width: '90%', margin: '10px auto' }}>
      <LogoBar/>
    </div>
  </Provider>
);