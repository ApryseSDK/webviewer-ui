import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SpreadsheetEditorFontFamilyDropdown from './SpreadsheetFontFamilyDropdown';
import initialState from 'src/redux/initialState';
import { cssFontValues } from 'src/constants/fonts/fonts';
import { availableSpreadsheetEditorFonts } from 'src/constants/fonts/spreadsheetEditorFonts';

export default {
  title: 'SpreadsheetEditor/FontFamilyDropdown',
  component: SpreadsheetEditorFontFamilyDropdown,
};

const DEFAULT_FONT_NAME = 'Arial';

const store = configureStore({
  reducer: () => ({
    ...initialState,
    viewer: {
      ...initialState.viewer,
      uiConfiguration: 'spreadsheetEditor',
    },
    spreadsheetEditor: {
      availableFontFaces: availableSpreadsheetEditorFonts,
      cssFontValues: cssFontValues,
      cellProperties: {
        styles: {
          font: {
            fontFace: DEFAULT_FONT_NAME
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
        <SpreadsheetEditorFontFamilyDropdown {...props} />
      </div>
    </Provider>
  );
};

Basic.parameters = window.storybook.disableRtlMode;
