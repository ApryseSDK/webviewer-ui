import React from 'react';
import SheetTab from './SheetTab';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const customViewports = {
  ViewOptionOne: {
    name: 'Custom View Port',
    styles: {
      width: '200px',
      height: '200px',
    },
  },
};


export default {
  title: 'SpreadsheetEditor/SheetTab',
  component: SheetTab,
  parameters: {
    viewport: {
      viewports: customViewports,
      defaultViewport: 'ViewOptionOne'
    }
  },
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    flyoutMap: {},
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    editMode: 'editing',
  }
};

const sheets = [
  { sheetIndex: 0, name: 'SheetName', disabled: true },
  { sheetIndex: 1, name: 'SheetName 1' },
];

const tabObject = {
  sheet: { sheetIndex: 0, name: 'SheetName' },
  sheetCount: sheets.length,
  activeSheetLabel: 'SheetName',
};
export const Basic = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <SheetTab {...tabObject}/>
      </div>
    </Provider>
  );
};

Basic.parameters = window.storybook.disableRtlMode;

