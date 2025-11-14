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
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

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

export const moreOptionsFlyoutTest = createTemplate(editingModeTemplate);

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
  const menuButton = canvas.getByRole('button', { name: getTranslatedText('component.menuOverlay') });
  expect(menuButton).toHaveFocus();

  const editFileNameLabel = `${getTranslatedText('action.edit')} ${getTranslatedText('saveModal.fileName')}`;

  const topHeaderItems = [
    { role: 'textbox', name: getTranslatedText('action.zoomSet') },
    { role: 'button', name: getTranslatedText('option.settings.zoomOptions') },
    { role: 'button', name: getTranslatedText('action.zoomOut') },
    { role: 'button', name: getTranslatedText('action.zoomIn') },
    { role: 'button', name: new RegExp(editFileNameLabel) }, // regex for dynamic file name
  ];

  for (const item of topHeaderItems) {
    await userEvent.keyboard('{ArrowRight}');
    const headerItem = canvas.getByRole(item.role, { name: item.name });
    expect(headerItem).toHaveFocus();
  }

  // List of all toolbar items in order (update as needed)
  const toolbarItems = [
    { role: 'button', name: getTranslatedText('action.cut') },
    { role: 'button', name: getTranslatedText('action.copy') },
    { role: 'button', name: getTranslatedText('action.paste') },
    { role: 'combobox', name: getTranslatedText('spreadsheetEditor.fontFamily.dropdownLabel') },
    { role: 'combobox', name: getTranslatedText('spreadsheetEditor.fontSize.dropdownLabel') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.bold') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.italic') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.underline') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.strikeout') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.textColor') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.cellBackgroundColor') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.textAlignment') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.cellAdjustment') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.cellBorderStyle') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.merge') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.currencyFormat') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.percentFormat') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.decreaseDecimalFormat') },
    { role: 'button', name: getTranslatedText('spreadsheetEditor.increaseDecimalFormat') },
    { role: 'button', name: getTranslatedText('action.more') },
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
  const fileNameButton = canvas.getByRole('button', { name: new RegExp(editFileNameLabel) });
  expect(fileNameButton).toHaveFocus();

  const searchToggle = canvas.getByRole('button', { name: getTranslatedText('component.searchPanel') });
  await userEvent.click(searchToggle);
  expect(searchToggle).toHaveFocus();
  const searchPanel = canvasElement.querySelector('[data-element="searchPanel"]');
  expect(searchPanel).toBeInTheDocument();

  const textInput = await canvas.findByRole('textbox', { name: getTranslatedText('message.searchDocumentPlaceholder') });
  expect(textInput).toBeInTheDocument();

  await userEvent.type(textInput, 'hello world');
  await expect(textInput).toHaveValue('hello world');
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

moreOptionsFlyoutTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const moreButton = await canvas.findByRole('button', { name: getTranslatedText('action.more') });
  if (!moreButton) {
    return;
  }

  await userEvent.click(moreButton);
  const insertImageButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.insertImage') });
  expect(insertImageButton).toBeInTheDocument();
};