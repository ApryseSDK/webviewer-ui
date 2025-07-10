import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CellTextColor from './CellTextColor';
import initialState from 'src/redux/initialState';

export default {
  title: 'SpreadsheetEditor/CellTextColor',
  component: CellTextColor,
};

const store = configureStore({
  reducer: () => ({
    ...initialState,
    viewer: {
      ...initialState.viewer,
      uiConfiguration: 'spreadsheetEditor',
    }
  }),
});

export const Basic = () => {
  const props = {
    onKeyDownHandler: () => {},
    disabled: false,
    isFlyoutItem: true,
  };

  return (
    <Provider store={store}>
      <div style={{ width: '310px', padding: '16px' }}>
        <CellTextColor {...props} />
      </div>
    </Provider>
  );
};
