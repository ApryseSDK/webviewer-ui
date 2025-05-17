import App from 'components/App';
import { createTemplate } from 'helpers/storybookHelper';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';
import { defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap
} from 'src/redux/spreadsheetEditorComponents';
import { userEvent, within, expect } from '@storybook/test';

export default {
  title: 'SpreadsheetEditor/App/CellStyleButtons',
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
    }
  },
  editMode: 'editing',
};

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
  test: {
    // Workaround for responsive error being thrown even though the test passes.
    dangerouslyIgnoreUnhandledErrors: true,
  }
};

CellAlignments.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const cellAlignmentButton = await canvas.findByRole('button', { name: 'Text Alignment' });
  await userEvent.click(cellAlignmentButton);

  // Seven buttons and one label should be visible
  const flyoutLabel = await canvas.findByText('Text Alignment');
  expect(flyoutLabel).toBeInTheDocument();

  const leftAlign = await canvas.findByRole('button', { name: 'Left align' });
  expect(leftAlign).toBeInTheDocument();

  const centerAlign = await canvas.findByRole('button', { name: 'Center align' });
  expect(centerAlign).toBeInTheDocument();

  const rightAlign = await canvas.findByRole('button', { name: 'Right align' });
  expect(rightAlign).toBeInTheDocument();

  const topAlign = await canvas.findByRole('button', { name: 'Top align' });
  expect(topAlign).toBeInTheDocument();

  const middleAlign = await canvas.findByRole('button', { name: 'Middle align' });
  expect(middleAlign).toBeInTheDocument();

  const bottomAlign = await canvas.findByRole('button', { name: 'Bottom align' });
  expect(bottomAlign).toBeInTheDocument();

  //Left Align and Middle Align are mocked as active in the current state
  expect(leftAlign).toHaveAttribute('aria-pressed', 'true');
  expect(middleAlign).toHaveAttribute('aria-pressed', 'true');
  await userEvent.click(cellAlignmentButton);
};

CellFormats.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const moreOptions = await canvas.findByRole('button', { name: /^More$/i });
  await userEvent.click(moreOptions);

  // Seven buttons and one label should be visible
  const cellFormatButton = await canvas.findByRole('button', { name: 'More cell format options' });
  await userEvent.click(cellFormatButton);

  const flyoutLabel = await canvas.findByText('Cell Format');
  expect(flyoutLabel).toBeInTheDocument();

  const automatic = await canvas.findByRole('button', { name: 'Automatic' });
  expect(automatic).toBeInTheDocument();

  const currency = await canvas.findByRole('button', { name: 'Accounting' });
  expect(currency).toBeInTheDocument();

  const financial = await canvas.findByRole('button', { name: 'Financial' });
  expect(financial).toBeInTheDocument();

  const currencyRounded = await canvas.findByRole('button', { name: 'Currency rounded' });
  expect(currencyRounded).toBeInTheDocument();

  const date = await canvas.findByRole('button', { name: 'Date' });
  expect(date).toBeInTheDocument();

  const time = await canvas.findByRole('button', { name: 'Time' });
  expect(time).toBeInTheDocument();

  const dateTime = await canvas.findByRole('button', { name: 'Date Time' });
  expect(dateTime).toBeInTheDocument();

  expect(currencyRounded).toHaveAttribute('aria-pressed', 'true');

  await userEvent.click(moreOptions);
};
