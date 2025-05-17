import App from 'components/App';
import { createTemplate } from 'helpers/storybookHelper';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';
import { defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap
} from 'src/redux/spreadsheetEditorComponents';

export default {
  title: 'SpreadsheetEditor/App',
  component: App,
};

export const EditingModeUI = createTemplate({
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
      styles: {
        verticalAlignment: null,
        horizontalAlignment: null,
        font: {
          bold: false,
          italic: false,
          underline: false,
          strikeout: false,
        },
        formatType: null,
      }
    },
  },
});

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