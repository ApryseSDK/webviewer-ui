import { createTemplate, defaultSpreadSheetEditorState } from 'helpers/storybookHelper';
import {
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap,
} from 'src/redux/spreadsheetEditorComponents';
import { expect, userEvent, within } from 'storybook/test';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import App from 'components/App';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'SpreadsheetEditor/App/Flyouts',
  component: App,
};

const templateObject = {
  uiConfiguration: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
  headers: defaultSpreadsheetEditorHeaders,
  components: {
    ...defaultSpreadsheetEditorComponents,
  },
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
  spreadsheetEditorRedux: defaultSpreadSheetEditorState,
};

export const FlyoutsInTheApp = createTemplate(templateObject);

FlyoutsInTheApp.parameters = {
  ...FlyoutsInTheApp.parameters,
};

FlyoutsInTheApp.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const textColorLabel = getTranslatedText('spreadsheetEditor.textColor');
  const cellTextColorToggleButton = await canvas.findByRole('button', { name: textColorLabel });
  await userEvent.click(cellTextColorToggleButton);
  // eslint-disable-next-line custom/no-hex-colors
  await canvas.findByRole('button', { name: /#000000/ });

  // Add a new color button
  const addNewColorLabel = `${getTranslatedText('action.addNewColor')} ${getTranslatedText('action.fromCustomColorPicker')}`;
  const addColorButton = await canvas.findByRole('button', { name: addNewColorLabel });
  await userEvent.click(addColorButton);
  const input = await canvas.findByRole('textbox', { name: /hex/i });
  await userEvent.clear(input);
  await userEvent.type(input, 'bbcc00');
  const okButton = await canvas.findByRole('button', { name: getTranslatedText('action.ok') });
  await userEvent.click(okButton);
  // eslint-disable-next-line custom/no-hex-colors
  const newTextColorButton = await canvas.findByRole('button', { name: /#BBCC00/ });
  // Check if new text color option is presented in the color picker
  expect(newTextColorButton).toBeInTheDocument();

  const cellAdjustmentButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.cellAdjustment') });
  await userEvent.click(cellAdjustmentButton);
  const buttonInCellAdjustmentFlyout = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.deleteRow') });
  expect(buttonInCellAdjustmentFlyout).toBeInTheDocument();

  const alignTopButtonInHeader = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.textAlignment') });
  await userEvent.click(alignTopButtonInHeader);
  const buttonInTextAlignmentFlyout = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.leftAlign') });
  expect(buttonInTextAlignmentFlyout).toBeInTheDocument();
  await userEvent.click(alignTopButtonInHeader);

  const cellBackgroundColorToggleButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.cellBackgroundColor') });
  await userEvent.click(cellBackgroundColorToggleButton);
  // eslint-disable-next-line custom/no-hex-colors
  const cellBackgroundColorsFlyout = await canvas.findByRole('button', { name: /#000000/ });
  expect(cellBackgroundColorsFlyout).toBeInTheDocument();
  // Color option from text color should not present in the background color picker
  expect(canvas.queryByRole('button', { name: /#BBCC00/ })).toBe(null);

  const moreButton = canvas.queryByRole('button', { name: getTranslatedText('action.more') });
  await userEvent.click(moreButton);
  const undoButton = await canvas.findByRole('button', { name: getTranslatedText('action.undo') });
  expect(undoButton).toBeInTheDocument();
  const redoButton = await canvas.findByRole('button', { name: getTranslatedText('action.redo') });
  expect(redoButton).toBeInTheDocument();
  const cellFormatMoreOptions = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.cellFormatMoreOptions') });
  await userEvent.click(cellFormatMoreOptions);
  const buttonInCellFormatFlyout = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.financialFormat') });
  expect(buttonInCellFormatFlyout).toBeInTheDocument();
  await userEvent.click(moreButton);

  const boldButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.bold') });
  await expect(boldButton).toHaveAttribute('aria-current', 'true');
  const italicButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.italic') });
  await expect(italicButton).toHaveAttribute('aria-current', 'false');
  const underlineButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.underline') });
  await expect(underlineButton).toHaveAttribute('aria-current', 'true');
  const strikeoutButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.strikeout') });
  await expect(strikeoutButton).toHaveAttribute('aria-current', 'false');
};

export const FlyoutWithColorPickerAccessibility = createTemplate(templateObject);

FlyoutWithColorPickerAccessibility.parameters = {
  ...FlyoutsInTheApp.parameters,
};

FlyoutWithColorPickerAccessibility.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const toolsHeader = await canvas.findByRole('toolbar', { name: 'spreadsheetEditorToolsHeader' });
  await toolsHeader.focus();
  for (let i = 0; i < 9; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }
  const cellTextColorToggleButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.textColor') });
  await userEvent.keyboard('[Enter]');
  const resetToDefaultButton = await canvas.findByRole('button', { name: getTranslatedText('action.resetDefault') });
  expect(resetToDefaultButton).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}');
  const showLessButton = await canvas.getByRole('button', { name: getTranslatedText('action.showLessColors') });
  expect(showLessButton).toHaveFocus();

  for (let i = 0; i < 7; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }
  // eslint-disable-next-line custom/no-hex-colors
  const colorButton = await canvas.findByRole('button', { name: /#FFFFFF/ });
  expect(colorButton).toHaveFocus();

  await userEvent.keyboard('[Escape]');
  await cellTextColorToggleButton.focus();
};