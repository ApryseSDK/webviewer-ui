import React, { useEffect } from 'react';
import core from 'core';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';
import { menuItems } from 'components/ModularComponents/Helpers/menuItems';
import { PRESET_BUTTON_TYPES, ITEM_TYPE } from 'constants/customizationVariables';
import { defaultSpreadsheetFlyoutMap } from '../../../redux/spreadsheetEditorComponents';
import { oePartialState } from 'helpers/storybookHelper';
import { within, fireEvent } from 'storybook/test';
import initialState from 'src/redux/initialState';

const originalCoreGetDocumentViewer = core.getDocumentViewer;

const createMockDocumentViewer = (getSelectedCellRange, cells) => () => ({
  getSpreadsheetEditorManager: () => ({
    getSelectedCellRange,
    getSelectedCells: () => cells,
  }),
});

const mockReturnRange = () => ({ firstRow: 0, lastRow: 1, firstColumn: 0, lastColumn: 1 });
const mockCells = [{ getStyle: () => ({ getCellBorder: () => ({ style: 'None' }) }) }, {}];

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
    ...initialState.spreadsheetEditor,
    'activeCellRange': 'A1',
    'cellProperties': {
      'cellType': 3,
      'stringCellValue': '[Company Name]',
      'topLeftRow': 0,
      'topLeftColumn': 0,
      'bottomRightRow': 0,
      'bottomRightColumn': 0,
      'isSingleCell': true,
      'styles': {
        'verticalAlignment': 'middle',
        'horizontalAlignment': 'left',
        'formatType': 'currencyRoundedFormat',
        'isCellRangeMerged': false,
        'border': {
          // eslint-disable-next-line custom/no-hex-colors
          'top': { type: 'Top', style: 'Thin', color: '#000000' }
        }
      }
    },
    editMode: 'editing',
  }
});

const createStore = (activeFlyout, openElement) => {
  const initialState = createInitialState(activeFlyout, openElement);
  return configureStore({ reducer: () => initialState });
};

const WithResetCoreViewer = ({ children }) => {
  useEffect(() => {
    return () => {
      core.getDocumentViewer = originalCoreGetDocumentViewer;
    };
  }, []);
  return children;
};

const withStoreAndMockedCore = (activeFlyout, openElement) => {
  const decorator = (Story) => {
    core.getDocumentViewer = createMockDocumentViewer(mockReturnRange, mockCells);
    const store = createStore(activeFlyout, openElement);
    return (
      <Provider store={store}>
        <WithResetCoreViewer>
          <Story />
        </WithResetCoreViewer>
      </Provider>
    );
  };
  decorator.displayName = `withStoreAndMockedCore(${activeFlyout})`;
  return decorator;
};

export default {
  title: 'SpreadsheetEditor/Flyouts',
  component: Flyout,
};

export const MainMenuFlyout = () => <Flyout />;
MainMenuFlyout.decorators = [withStoreAndMockedCore(DataElements.MAIN_MENU, DataElements.MAIN_MENU)];

export const CellFormatFlyout = () => <Flyout />;
CellFormatFlyout.decorators = [withStoreAndMockedCore(DataElements.CELL_FORMAT_MORE_FLYOUT, DataElements.CELL_FORMAT_MORE_FLYOUT)];

export const CellAdjustmentFlyout = () => <Flyout />;
CellAdjustmentFlyout.decorators = [withStoreAndMockedCore(DataElements.CELL_ADJUSTMENT_FLYOUT, DataElements.CELL_ADJUSTMENT_FLYOUT)];

export const CellBorderFlyoutWithDropdown = () => <Flyout />;
CellBorderFlyoutWithDropdown.decorators = [withStoreAndMockedCore(DataElements.CELL_BORDER_FLYOUT, DataElements.CELL_BORDER_FLYOUT)];
CellBorderFlyoutWithDropdown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dropdown = canvas.getByRole('combobox');
  fireEvent.mouseDown(dropdown);
};

export const CellTextAlignmentFlyout = () => <Flyout />;
CellTextAlignmentFlyout.decorators = [withStoreAndMockedCore(DataElements.CELL_TEXT_ALIGNMENT_FLYOUT, DataElements.CELL_TEXT_ALIGNMENT_FLYOUT)];