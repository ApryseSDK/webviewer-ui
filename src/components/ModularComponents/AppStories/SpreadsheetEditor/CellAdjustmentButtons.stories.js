import App from 'components/App';
import { fn, within, expect } from '@storybook/test';
import { createTemplate } from 'helpers/storybookHelper';
import { VIEWER_CONFIGURATIONS, CELL_ADJUSTMENT_FLYOUT_ITEMS } from 'src/constants/customizationVariables';
import {
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap,
} from 'src/redux/spreadsheetEditorComponents';
import core from 'core';

export default {
  title: 'SpreadsheetEditor/App/CellAdjustmentButtons',
  component: App,
};

const initialRedux = {
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
      'font': {
        'bold': true,
        'italic': false,
        'underline': false,
        'strikeout': false,
      },
    },
  },
  editMode: 'editing',
};

export const CellAdjustmentItems = createTemplate({
  uiConfiguration: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
  headers: {
    ...defaultSpreadsheetEditorHeaders,
    'tools-header': {
      ...defaultSpreadsheetEditorHeaders['tools-header'],
      items: CELL_ADJUSTMENT_FLYOUT_ITEMS.map((i) => i === 'divider' ? 'divider-0.1' : i),
    },
  },
  components: defaultSpreadsheetEditorComponents,
  flyoutMap: defaultSpreadsheetFlyoutMap,
  viewerRedux: {
    isSpreadsheetEditorModeEnabled: true,
    openElements: {
      spreadsheetSwitcher: true,
    },
    disabledElements: {
      'newSpreadsheetButton': { disabled: false },
      'logoBar': { disabled: true },
    },
  },
  spreadsheetEditorRedux: initialRedux,
});

CellAdjustmentItems.play = async ({ canvasElement }) => {
  const docViewerObject = core.getDocumentViewer();
  const documentObject = core.getDocument();
  let originalManager = docViewerObject.getSpreadsheetEditorManager;
  let originalDocument = documentObject.getSpreadsheetEditorDocument;
  const mockCellRange = {
    firstRow: 1,
    lastRow: 3,
    firstColumn: 1,
    lastColumn: 3,
  };
  docViewerObject.getSpreadsheetEditorManager = () => ({
    getSelectedCellRange: () => mockCellRange,
  });
  const mockFunctions = {
    createColumns: fn().mockName('createColumns'),
    createRow: fn().mockName('createRow'),
    removeRows: fn().mockName('removeRows'),
    removeColumns: fn().mockName('removeColumns'),
  };
  documentObject.getSpreadsheetEditorDocument = () => ({
    getWorkbook: () => ({
      getSheetAt: () => mockFunctions,
    }),
  });

  const canvas = await within(canvasElement);
  // Have to do this to ensure UI config has switched and loaded the buttons
  await canvas.findByRole('button', { name: /Insert column left/gi });

  // Insert 1 column at index 1
  await canvas.getByRole('button', { name: /Insert column left/gi }).click();
  await expect(mockFunctions.createColumns.mock.lastCall[0]).toBe(1);
  await expect(mockFunctions.createColumns.mock.lastCall[1]).toBe(1);

  // Insert 1 column at index 4
  await canvas.getByRole('button', { name: /Insert column right/gi }).click();
  await expect(mockFunctions.createColumns.mock.lastCall[0]).toBe(4);

  // Insert row at index 1
  await canvas.getByRole('button', { name: /Insert row above/gi }).click();
  await expect(mockFunctions.createRow.mock.lastCall[0]).toBe(1);

  // Insert row at index 4
  await canvas.getByRole('button', { name: /Insert row below/gi }).click();
  await expect(mockFunctions.createRow.mock.lastCall[0]).toBe(4);

  // Delete column at index 1-3
  await canvas.getByRole('button', { name: /Delete column/gi }).click();
  await expect(mockFunctions.removeColumns.mock.lastCall[0]).toBe(1);
  await expect(mockFunctions.removeColumns.mock.lastCall[1]).toBe(3);

  // Delete row at index 1-3
  await canvas.getByRole('button', { name: /Delete row/gi }).click();
  await expect(mockFunctions.removeRows.mock.lastCall[0]).toBe(1);
  await expect(mockFunctions.removeRows.mock.lastCall[1]).toBe(3);

  documentObject.getSpreadsheetEditorDocument = originalDocument;
  docViewerObject.getSpreadsheetEditorManager = originalManager;
};