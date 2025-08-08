import App from 'components/App';
import { createTemplate } from 'helpers/storybookHelper';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';
import {
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap
} from 'src/redux/spreadsheetEditorComponents';
import { within, expect, userEvent } from 'storybook/test';
import initialState from 'src/redux/initialState';

export default {
  title: 'SpreadsheetEditor/App',
  component: App,
};

const editingModeTemplate = {
  uiConfiguration: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
  headers: defaultSpreadsheetEditorHeaders,
  components: defaultSpreadsheetEditorComponents,
  flyoutMap: defaultSpreadsheetFlyoutMap,
  viewerRedux: {
    flyoutMap: {},
    openElements: {
      spreadsheetSwitcher: true,
    },
    disabledElements: {
      'newSpreadsheetButton': { disabled: false },
      'logoBar': { disabled: true },
    },
    isSpreadsheetEditorModeEnabled: true
  },
  spreadsheetEditorRedux: {
    editMode: 'editing',
    cellProperties: {
      cellType: null,
      cellFormula: null,
      stringCellValue: null,
      topLeftRow: null,
      topLeftColumn: null,
      bottomRightRow: null,
      bottomRightColumn: null,
      canCopy: true,
      canPaste: true,
      canCut: true,
      styles: {
        verticalAlignment: null,
        horizontalAlignment: null,
        font: {
          fontFace: 'Arial',
          pointSize: 8,
          bold: false,
          italic: false,
          underline: false,
          strikeout: false,
        },
        formatType: null,
      }
    },
  },
};

export const EditingModeUI = createTemplate(editingModeTemplate);

export const EditingModeHeaderKeyboardNavigationTest = createTemplate(editingModeTemplate);

EditingModeUI.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const contentContainer = canvasElement.querySelector('.content');
  const documentContainer = canvas.getByRole('tabpanel');

  expect(documentContainer).toBeInTheDocument();
  const containerRect = documentContainer.getBoundingClientRect();
  const contentRect = contentContainer.getBoundingClientRect();
  const { bottomHeaders } = initialState.viewer.modularHeadersHeight;
  expect(containerRect.height + bottomHeaders).toEqual(contentRect.height);
};

EditingModeHeaderKeyboardNavigationTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.tab();
  const menuButton = canvas.getByRole('button', { name: 'Menu' });
  expect(menuButton).toHaveFocus();

  const topHeaderItems = [
    { role: 'textbox', name: 'Set zoom' },
    { role: 'button', name: 'Zoom Options' },
    { role: 'button', name: 'Zoom out' },
    { role: 'button', name: 'Zoom in' },
    { role: 'button', name: /^Edit File Name/ }, // regex for dynamic file name
  ];

  for (const item of topHeaderItems) {
    await userEvent.keyboard('{ArrowRight}');
    const headerItem = canvas.getByRole(item.role, { name: item.name });
    expect(headerItem).toHaveFocus();
  }

  // List of all toolbar items in order (update as needed)
  const toolbarItems = [
    { role: 'button', name: 'Cut' },
    { role: 'button', name: 'Copy' },
    { role: 'button', name: 'Paste' },
    { role: 'combobox', name: 'Font Family' },
    { role: 'combobox', name: 'Font Size' },
    { role: 'button', name: 'Bold' },
    { role: 'button', name: 'Italic' },
    { role: 'button', name: 'Underline' },
    { role: 'button', name: 'Strikeout' },
    { role: 'button', name: 'Text Color' },
    { role: 'button', name: 'Background Color' },
    { role: 'button', name: 'Text Alignment' },
    { role: 'button', name: 'Cell Adjustment' },
    { role: 'button', name: 'Border Style' },
    { role: 'button', name: 'Merge' },
    { role: 'button', name: 'Currency' },
    { role: 'button', name: 'Percent' },
    { role: 'button', name: 'Decrease decimal' },
    { role: 'button', name: 'Increase decimal' },
    { role: 'button', name: 'More cell format options' },
  ];

  // Focus the first toolbar item
  await userEvent.tab();
  let currentItem = canvas.getByRole(toolbarItems[0].role, { name: toolbarItems[0].name });
  expect(currentItem).toHaveFocus();

  // Arrow through the rest
  for (let i = 1; i < toolbarItems.length; i++) {
    await userEvent.keyboard('{ArrowRight}');
    currentItem = canvas.getByRole(toolbarItems[i].role, { name: toolbarItems[i].name });
    expect(currentItem).toHaveFocus();
  }

  await userEvent.keyboard('{Home}');
  currentItem = canvas.getByRole(toolbarItems[0].role, { name: toolbarItems[0].name });
  expect(currentItem).toHaveFocus();

  await userEvent.keyboard('{End}');
  currentItem = canvas.getByRole(toolbarItems[toolbarItems.length - 1].role, { name: toolbarItems[toolbarItems.length - 1].name });
  expect(currentItem).toHaveFocus();

  // Shift+Tab should return focus to the file name button
  await userEvent.tab({ shift: true });
  const fileNameButton = canvas.getByRole('button', { name: /^Edit File Name/ });
  expect(fileNameButton).toHaveFocus();

  const searchToggle = canvas.getByRole('button', { name: 'Search' });
  await userEvent.click(searchToggle);
  expect(searchToggle).toHaveFocus();
  const searchPanel = canvasElement.querySelector('[data-element="searchPanel"]');
  expect(searchPanel).toBeInTheDocument();
};

export const ViewOnlyUI = createTemplate({
  headers: defaultSpreadsheetEditorHeaders,
  components: defaultSpreadsheetEditorComponents,
  flyoutMap: defaultSpreadsheetFlyoutMap,
  viewerRedux: {
    uiConfiguration: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
    disabledElements: {
      'spreadsheetEditorToolsHeader': { disabled: true },
      'newSpreadsheetButton': { disabled: true },
      'logoBar': { disabled: true },
    },
    openElements: {
      spreadsheetSwitcher: true,
    },
    isSpreadsheetEditorModeEnabled: true
  },
  spreadsheetEditorRedux: {
    editMode: 'viewOnly',
  },
});