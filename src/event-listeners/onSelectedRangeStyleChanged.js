import actions from 'actions';
import {
  verticalAlignmentLabels,
  horizontalAlignmentLabels,
} from 'constants/spreadsheetEditor';
import getFormatTypeFromFormatString from 'src/helpers/getFormatTypeFromFormatString';
import core from 'core';

const filterUndefined = (obj) =>
  // eslint-disable-next-line no-unused-vars
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export default (dispatch) => (styleObject) => {
  const verticalAlignment = verticalAlignmentLabels[styleObject.verticalAlignment];
  const horizontalAlignment = horizontalAlignmentLabels[styleObject.horizontalAlignment];
  const backgroundColor = styleObject.backgroundColor;
  const formatType = getFormatTypeFromFormatString(styleObject.formatString);
  const isCellRangeMerged = styleObject.merge;
  const borderStyle = styleObject.border;

  const canUndo = core.getDocumentViewer().getSpreadsheetEditorManager().getSpreadsheetEditorHistoryManager().canUndo();
  const canRedo = core.getDocumentViewer().getSpreadsheetEditorManager().getSpreadsheetEditorHistoryManager().canRedo();

  const filteredPayload = filterUndefined({
    verticalAlignment,
    horizontalAlignment,
    font: styleObject.font,
    formatType,
    isCellRangeMerged,
    backgroundColor,
    borderStyle
  });

  dispatch(actions.setSpreadsheetEditorCanUndo(canUndo));
  dispatch(actions.setSpreadsheetEditorCanRedo(canRedo));

  if (Object.keys(filteredPayload).length > 0) {
    dispatch(actions.setActiveCellRangeStyle(filteredPayload));
  }
};