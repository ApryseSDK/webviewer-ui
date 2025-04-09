import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

const SpreadsheetEditorEditMode = window.Core.SpreadsheetEditor.SpreadsheetEditorEditMode;

const viewOnlyDisabledElements = [
  DataElements.SPREADSHEET_EDITOR_TOOLS_HEADER,
  PRESET_BUTTON_TYPES.NEW_SPREADSHEET,
];

export default (dispatch) => (mode) => {
  dispatch(actions.setSpreadsheetEditorEditMode(mode));
  switch (mode) {
    case SpreadsheetEditorEditMode['VIEW_ONLY']:
      dispatch(actions.disableElements(viewOnlyDisabledElements));
      break;
    case SpreadsheetEditorEditMode['EDITING']:
      dispatch(actions.enableElements(viewOnlyDisabledElements));
      break;
    default:
      break;
  }
};