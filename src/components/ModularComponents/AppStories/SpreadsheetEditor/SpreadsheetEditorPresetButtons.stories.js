import { createTemplate, defaultSpreadSheetEditorState } from 'helpers/storybookHelper';
import {
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetFlyoutMap,
} from 'src/redux/spreadsheetEditorComponents';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';
import App from 'components/App';

export default {
  title: 'SpreadsheetEditor/App/PresetButtons',
  component: App,
};


const basePresetButtonsConfig = {
  uiConfiguration: VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
  headers: defaultSpreadsheetEditorHeaders,
  components: {
    ...defaultSpreadsheetEditorComponents,
    spreadsheetEditorHomeGroupedItems: {
      ...defaultSpreadsheetEditorComponents.spreadsheetEditorHomeGroupedItems,
      items: [
        ...defaultSpreadsheetEditorComponents.spreadsheetEditorHomeGroupedItems.items,
        'alignTopButton',
        'alignMiddleButton',
        'alignBottomButton',
        'insertColumnLeft',
        'insertColumnRight',
        'automaticFormat',
        'accountingFormat',
        'percentFormat',
      ]
    },
    insertColumnLeft: {
      dataElement: 'insertColumnLeft',
      type: 'presetButton',
      buttonType: 'insertColumnLeft'
    },
    insertColumnRight: {
      dataElement: 'insertColumnRight',
      type: 'presetButton',
      buttonType: 'insertColumnRight'
    },
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
};

export const PresetButtonsInTheApp = createTemplate({
  ...basePresetButtonsConfig,
  spreadsheetEditorRedux: defaultSpreadSheetEditorState,
});

export const PresetButtonsWithCanUndoAndRedo = createTemplate({
  ...basePresetButtonsConfig,
  spreadsheetEditorRedux: {
    ...defaultSpreadSheetEditorState,
    canUndo: true,
    canRedo: true,
  },
});
