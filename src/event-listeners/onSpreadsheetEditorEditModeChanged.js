import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import { PRIORITY_THREE } from 'constants/actionPriority';

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
      dispatch(actions.disableElements([DataElements.SEARCH_PANEL_REPLACE_CONTAINER], PRIORITY_THREE));
      break;
    case SpreadsheetEditorEditMode['EDITING']:
      dispatch(actions.enableElements(viewOnlyDisabledElements));
      dispatch(actions.enableElements([DataElements.SEARCH_PANEL_REPLACE_CONTAINER], PRIORITY_THREE));
      break;
    default:
      break;
  }
};