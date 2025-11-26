import core from 'core';
import { CELL_BORDER_BUTTONS } from 'src/constants/customizationVariables';

/**
 * @typedef {Object} BorderButtonDisplayMap
 * @property {boolean} None
 * @property {boolean} All
 * @property {boolean} Top
 * @property {boolean} Left
 * @property {boolean} Right
 * @property {boolean} Bottom
 * @property {boolean} Outside
 * @property {boolean} Inside
 * @property {boolean} Vertical
 * @property {boolean} Horizontal
 * @ignore
 */

/**
 * @ignore
 * Determines the visibility of border buttons in the spreadsheet editor UI, based on the current cell selection and a predefined display configuration.
 * Border buttons like "Top", "Left", are always shown, where "Inside" / "Vertical" / "Horizontal" / "All" are conditionally shown only when multiple cells are selected.
 * @returns {BorderButtonDisplayMap} An object mapping each border type to a boolean
 * indicating whether its corresponding button should be shown.
 */
function getButtonDisplay() {
  const seManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const activeCells = seManager.getSelectedCells();
  const activeCellRange = seManager.getSelectedCellRange();
  const buttonDisplay = {};
  const isSingleRow = activeCellRange.firstRow === activeCellRange.lastRow;
  const isSingleColumn = activeCellRange.firstColumn === activeCellRange.lastColumn;
  for (const key in CELL_BORDER_BUTTONS) {
    if (CELL_BORDER_BUTTONS[key] === 'alwaysShow') {
      buttonDisplay[key] = true;
    } else if ( CELL_BORDER_BUTTONS[key] === 'showForMultipleCells') {
      buttonDisplay[key] = activeCells.length > 1;
    }
  }
  if (isSingleRow) {
    buttonDisplay['Horizontal'] = false;
    buttonDisplay['Inside'] = false;
  }
  if (isSingleColumn) {
    buttonDisplay['Vertical'] = false;
    buttonDisplay['Inside'] = false;
  }
  return buttonDisplay;
}

export default getButtonDisplay;