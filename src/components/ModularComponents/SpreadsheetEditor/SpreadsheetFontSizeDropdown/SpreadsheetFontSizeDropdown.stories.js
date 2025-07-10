import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SpreadsheetEditorFontSizeDropdown from './SpreadsheetFontSizeDropdown';
import initialState from 'src/redux/initialState';

export default {
  title: 'SpreadsheetEditor/FontSizeDropdown',
  component: SpreadsheetEditorFontSizeDropdown,
};

const store = configureStore({
  reducer: () => ({
    ...initialState,
    viewer: {
      ...initialState.viewer,
      uiConfiguration: 'spreadsheetEditor',
    },
    spreadsheetEditor: {
      cellProperties: {
        styles: {
          font: {
            pointSize: 8
          }
        }
      }
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
        <SpreadsheetEditorFontSizeDropdown {...props} />
      </div>
    </Provider>
  );
};