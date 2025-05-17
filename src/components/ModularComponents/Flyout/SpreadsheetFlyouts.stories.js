import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';
import { PRESET_BUTTON_TYPES, ITEM_TYPE } from 'constants/customizationVariables';
import { defaultSpreadsheetFlyoutMap } from '../../../redux/spreadsheetEditorComponents';
import { oePartialState } from 'helpers/storybookHelper';
import { within } from '@storybook/test';
import { fireEvent } from '@testing-library/react';

export default {
  title: 'SpreadsheetEditor/Flyouts',
  component: Flyout,
};

const createInitialState = (activeFlyout, openElement) => ({
  ...oePartialState,
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      [openElement]: true,
    },
    genericPanels: [],
    flyoutMap: {
      [DataElements.MAIN_MENU]: {
        dataElement: DataElements.MAIN_MENU,
        items: [
          {
            ...menuItems[PRESET_BUTTON_TYPES.NEW_SPREADSHEET],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.FILE_PICKER],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.FULLSCREEN],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          {
            ...menuItems[PRESET_BUTTON_TYPES.SAVE_AS],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
          'divider',
          {
            ...menuItems[PRESET_BUTTON_TYPES.SETTINGS],
            type: ITEM_TYPE.PRESET_BUTTON,
          },
        ],
      },
      [DataElements.CELL_FORMAT_MORE_FLYOUT]: defaultSpreadsheetFlyoutMap[DataElements.CELL_FORMAT_MORE_FLYOUT],
      [DataElements.CELL_BORDER_FLYOUT]: defaultSpreadsheetFlyoutMap[DataElements.CELL_BORDER_FLYOUT],
      [DataElements.CELL_ADJUSTMENT_FLYOUT]: defaultSpreadsheetFlyoutMap[DataElements.CELL_ADJUSTMENT_FLYOUT],
      [DataElements.CELL_TEXT_ALIGNMENT_FLYOUT]: defaultSpreadsheetFlyoutMap[DataElements.CELL_TEXT_ALIGNMENT_FLYOUT],
      [DataElements.CELL_BORDER_FLYOUT]: defaultSpreadsheetFlyoutMap[DataElements.CELL_BORDER_FLYOUT],
    },
    modularComponents: {},
    flyoutPosition: { x: 0, y: 0 },
    activeFlyout,
    activeTabInPanel: {},
    modularHeaders: {},
    modularHeadersHeight: {
      topHeaders: 40,
      bottomHeaders: 40,
    },
    isSpreadsheetEditorModeEnabled: true,
    uiConfiguration: 'spreadsheetEditor',
  },
  featureFlags: {
    customizableUI: true,
  },
  spreadsheetEditor: {
    'activeCellRange': 'A1',
    'cellProperties': {
      'cellType': 3,
      'stringCellValue': '[Company Name]',
      'topLeftRow': 0,
      'topLeftColumn': 0,
      'bottomRightRow': 0,
      'bottomRightColumn': 0,
      'styles': {
        'verticalAlignment': 'middle',
        'horizontalAlignment': 'left',
        'formatType': 'currencyRoundedFormat',
      }
    },
    editMode: 'editing',
  }
});

const createStore = (activeFlyout, openElement) => {
  const initialState = createInitialState(activeFlyout, openElement);
  return configureStore({ reducer: () => initialState });
};

export const MainMenuFlyout = () => {
  const store = createStore(DataElements.MAIN_MENU, DataElements.MAIN_MENU);
  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};

export const CellFormatFlyout = () => {
  const store = createStore(DataElements.CELL_FORMAT_MORE_FLYOUT, DataElements.CELL_FORMAT_MORE_FLYOUT);
  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};

export const CellAdjustmentFlyout = () => {
  const store = createStore(DataElements.CELL_ADJUSTMENT_FLYOUT, DataElements.CELL_ADJUSTMENT_FLYOUT);
  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};

export const CellBorderFlyout = () => {
  const store = createStore(DataElements.CELL_BORDER_FLYOUT, DataElements.CELL_BORDER_FLYOUT);
  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};

export const CellBorderFlyoutWithDropdown = () => {
  const store = createStore(DataElements.CELL_BORDER_FLYOUT, DataElements.CELL_BORDER_FLYOUT);
  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};
CellBorderFlyoutWithDropdown.play = async ({ canvasElement }) => {
  const canvas = await within(canvasElement);
  const dropdown = canvas.getByRole('combobox');
  fireEvent.mouseDown(dropdown);
};

export const CellTextAlignmentFlyout = () => {
  const store = createStore(DataElements.CELL_TEXT_ALIGNMENT_FLYOUT, DataElements.CELL_TEXT_ALIGNMENT_FLYOUT);
  return (
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};