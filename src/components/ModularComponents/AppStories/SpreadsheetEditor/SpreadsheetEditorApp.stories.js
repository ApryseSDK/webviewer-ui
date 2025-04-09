import App from 'components/App';
import { createTemplate } from 'helpers/storybookHelper';
import { defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap
} from 'src/redux/spreadsheetEditorComponents';

export default {
  title: 'SpreadsheetEditor/App',
  component: App,
};

export const EditingModeUI = createTemplate({
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
  spreadsheetEditorRedux: {
    editMode: 'editing',
  },
});

export const ViewOnlyUI = createTemplate({
  headers: defaultSpreadsheetEditorHeaders,
  components: defaultSpreadsheetEditorComponents,
  flyoutMap: defaultSpreadsheetFlyoutMap,
  viewerRedux: {
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