import core from 'core';
import { formatsMap } from 'src/constants/spreadsheetEditor';
import { getDecimalAdjustedFormatString } from './getDecimalAdjustedFormatString';

/**
 * @ignore
 * Set the format string for the selected cells in the spreadsheet editor.
 * @param {string} formatType - The format type or 'increaseDecimalFormat' / 'decreaseDecimalFormat'
 */
function setCellFormatString(formatType) {
  let formatString;
  if (formatType === 'decreaseDecimalFormat' || formatType === 'increaseDecimalFormat') {
    formatString = getDecimalAdjustedFormatString(formatType);
  } else {
    formatString = formatsMap[formatType];
  }

  if (!formatString) {
    return;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  spreadsheetEditorManager.setSelectedCellsStyle({
    formatString,
  });
}

export default setCellFormatString;
