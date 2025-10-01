import App from 'components/App';
import { createTemplate, defaultSpreadSheetEditorState } from 'helpers/storybookHelper';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import {
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap,
} from 'src/redux/spreadsheetEditorComponents';
import { userEvent, within, expect } from 'storybook/test';

export default {
  title: 'SpreadsheetEditor/App/CellStyleButtons',
  component: App,
};

const initialRedux = defaultSpreadSheetEditorState;

const createTemplateWithSpreadsheetState = (initialState = initialRedux) => {
  return createTemplate({
    uiConfiguration: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
    headers: defaultSpreadsheetEditorHeaders,
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
    spreadsheetEditorRedux: initialState,
  });
};

export const CellAlignments = createTemplateWithSpreadsheetState({
  ...initialRedux,
  styles: {
    'verticalAlignment': 'middle',
    'horizontalAlignment': 'left',
  }
});

export const CellFormats = createTemplateWithSpreadsheetState({
  ...initialRedux,
  styles: {
    'formatType': 'currencyRoundedFormat',
  }
});
CellFormats.parameters ={
  ...CellFormats.parameters,
};

CellAlignments.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const cellAlignmentButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.textAlignment') });
  await userEvent.click(cellAlignmentButton);

  // Seven buttons and one label should be visible
  const flyoutLabel = await canvas.findByText(getTranslatedText('spreadsheetEditor.textAlignment'));
  expect(flyoutLabel).toBeInTheDocument();

  const leftAlign = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.leftAlign') });
  expect(leftAlign).toBeInTheDocument();

  const centerAlign = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.centerAlign') });
  expect(centerAlign).toBeInTheDocument();

  const rightAlign = await canvas.findByRole('button', { name: getTranslatedText('officeEditor.rightAlign') });
  expect(rightAlign).toBeInTheDocument();

  const topAlign = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.topAlign') });
  expect(topAlign).toBeInTheDocument();

  const middleAlign = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.middleAlign') });
  expect(middleAlign).toBeInTheDocument();

  const bottomAlign = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.bottomAlign') });
  expect(bottomAlign).toBeInTheDocument();

  //Left Align and Middle Align are mocked as active in the current state
  expect(leftAlign).toHaveAttribute('aria-pressed', 'true');
  expect(middleAlign).toHaveAttribute('aria-pressed', 'true');
  await userEvent.click(cellAlignmentButton);
};

CellFormats.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const moreOptions = canvas.queryByRole('button', { name: getTranslatedText('action.more') });
  await userEvent.click(moreOptions);

  // Seven buttons and one label should be visible
  const cellFormatButton = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.cellFormatMoreOptions') });
  await userEvent.click(cellFormatButton);

  const flyoutLabel = await canvas.findByText(getTranslatedText('spreadsheetEditor.cellFormat'));
  expect(flyoutLabel).toBeInTheDocument();

  const automatic = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.automaticFormat') });
  expect(automatic).toBeInTheDocument();

  const currency = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.accountingFormat') });
  expect(currency).toBeInTheDocument();

  const financial = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.financialFormat') });
  expect(financial).toBeInTheDocument();

  const currencyRounded = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.currencyRoundedFormat') });
  expect(currencyRounded).toBeInTheDocument();

  const date = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.calendarFormat') });
  expect(date).toBeInTheDocument();

  const time = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.clockHourFormat') });
  expect(time).toBeInTheDocument();

  const dateTime = await canvas.findByRole('button', { name: getTranslatedText('spreadsheetEditor.calendarTimeFormat') });
  expect(dateTime).toBeInTheDocument();

  expect(currencyRounded).toHaveAttribute('aria-pressed', 'true');

  await userEvent.click(moreOptions);
};
