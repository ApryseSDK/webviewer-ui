import core from 'core';
import { formatsMap } from 'src/constants/spreadsheetEditor';

function setCellFormatString(formatType) {
  const formatString = formatsMap[formatType];
  if (!formatString) {
    return;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellRangeStyle({
    formatString,
  });
}

export default setCellFormatString;