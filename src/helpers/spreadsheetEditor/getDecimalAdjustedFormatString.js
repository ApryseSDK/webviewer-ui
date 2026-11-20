import core from 'core';
import { adjustDecimalOnFormatString } from './decimalFormatHelpers';

/**
 * @ignore
 * Get the decimal-adjusted format string for the selected cell.
 * @param {string} type - 'increaseDecimalFormat' or 'decreaseDecimalFormat'
 * @returns {string} - The adjusted format string
 */
export function getDecimalAdjustedFormatString(type) {
  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const cells = spreadsheetEditorManager.getSelectedCells();
  const cell = cells[0];
  const cellStyle = cell.getStyle();
  if (!cellStyle) {
    return;
  }
  const currentFormatString = cellStyle.getDataFormatString();

  let newFormatString;
  // In the case of entering a number initially, the format string will be 'General' and the numericCellValue will be a number
  // we want to set the format string to '#0' in this case before adjusting the decimal
  const shouldSetToNumberFormat = currentFormatString === 'General' && !Number.isNaN(cell.numericCellValue);
  if (shouldSetToNumberFormat) {
    newFormatString = '#0';
  }

  newFormatString = adjustDecimalOnFormatString(newFormatString || currentFormatString, type);

  return newFormatString;
}

export default getDecimalAdjustedFormatString;
