import { createTemplate, defaultSpreadSheetEditorState } from 'helpers/storybookHelper';
import {
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap,
} from 'src/redux/spreadsheetEditorComponents';
import { expect, userEvent, within } from 'storybook/test';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import App from 'components/App';

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
  // eslint-disable-next-line custom/no-hex-colors
  const newTextColor = 'Text Color #BBCC00';

  const cellTextColorToggleButton = await canvas.findByRole('button', { name: 'Text Color' });
  await userEvent.click(cellTextColorToggleButton);
  // eslint-disable-next-line custom/no-hex-colors
  const textColorsFlyout = await canvas.findByRole('button', { name: 'Text Color #000000' });
  expect(textColorsFlyout).toBeInTheDocument();

  // Add a new color button
  const addColorButton = await canvas.findByRole('button', { name: 'Add New Color from Custom Color Picker' });
  await userEvent.click(addColorButton);
  const input = await canvas.findByRole('textbox', { name: /hex/i });
  await userEvent.clear(input);
  await userEvent.type(input, 'bbcc00');
  const okButton = await canvas.findByRole('button', { name: /ok/i });
  await userEvent.click(okButton);
  // eslint-disable-next-line custom/no-hex-colors
  const newTextColorButton = await canvas.findByRole('button', { name: newTextColor });
  // Check if new text color option is presented in the color picker
  expect(newTextColorButton).toBeInTheDocument();

  const cellAdjustmentButton = await canvas.findByRole('button', { name: 'Cell Adjustment' });
  await userEvent.click(cellAdjustmentButton);
  const buttonInCellAdjustmentFlyout = await canvas.findByRole('button', { name: 'Delete row' });
  expect(buttonInCellAdjustmentFlyout).toBeInTheDocument();

  const alignTopButtonInHeader = await canvas.findByRole('button', { name: 'Text Alignment' });
  await userEvent.click(alignTopButtonInHeader);
  const buttonInTextAlignmentFlyout = await canvas.findByRole('button', { name: 'Left align' });
  expect(buttonInTextAlignmentFlyout).toBeInTheDocument();
  await userEvent.click(alignTopButtonInHeader);

  const cellBackgroundColorToggleButton = await canvas.findByRole('button', { name: 'Background Color' });
  await userEvent.click(cellBackgroundColorToggleButton);
  // eslint-disable-next-line custom/no-hex-colors
  const cellBackgroundColorsFlyout = await canvas.findByRole('button', { name: 'Background Color #000000' });
  expect(cellBackgroundColorsFlyout).toBeInTheDocument();
  // Color option from text color should not present in the background color picker
  expect(canvas.queryByRole('button', { name: newTextColor })).toBe(null);

  const moreButton = canvas.queryByRole('button', { name: /^More$/i });
  await userEvent.click(moreButton);
  const cellFormatMoreOptions = await canvas.findByRole('button', { name: 'More cell format options' });
  await userEvent.click(cellFormatMoreOptions);
  const buttonInCellFormatFlyout = await canvas.findByRole('button', { name: 'Financial' });
  expect(buttonInCellFormatFlyout).toBeInTheDocument();
  await userEvent.click(moreButton);

  const boldButton = await canvas.findByRole('button', { name: 'Bold' });
  await expect(boldButton).toHaveAttribute('aria-current', 'true');
  const italicButton = await canvas.findByRole('button', { name: 'Italic' });
  await expect(italicButton).toHaveAttribute('aria-current', 'false');
  const underlineButton = await canvas.findByRole('button', { name: 'Underline' });
  await expect(underlineButton).toHaveAttribute('aria-current', 'true');
  const strikeoutButton = await canvas.findByRole('button', { name: 'Strikeout' });
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
  const cellTextColorToggleButton = await canvas.findByRole('button', { name: 'Text Color' });
  await userEvent.keyboard('[Enter]');
  const resetToDefaultButton = await canvas.findByRole('button', { name: 'Reset to default' });
  expect(resetToDefaultButton).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}');
  const showLessButton = await canvas.getByRole('button', { name: 'Show Less Colors' });
  expect(showLessButton).toHaveFocus();

  for (let i = 0; i < 7; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }
  // eslint-disable-next-line custom/no-hex-colors
  const colorButton = await canvas.findByRole('button', { name: 'Text Color #FFFFFF' });
  expect(colorButton).toHaveFocus();

  await userEvent.keyboard('[Escape]');
  await cellTextColorToggleButton.focus();
};