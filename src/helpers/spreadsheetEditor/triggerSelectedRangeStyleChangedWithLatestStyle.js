import { getStyleObjectFromCellStyle } from './getStyleObjectFromCellStyle';

/**
 * @ignore
 * This function is used after undo/redo to trigger the 'selectedRangeStyleChanged' event with the latest style
 * so that the UI can be updated accordingly.
 * This will likely be removed in the future when proper event flow for undo/redo is implemented.
 * @param {Core.SpreadsheetEditor.SpreadsheetEditorManager} spreadsheetEditorManager
 */
export const triggerSelectedRangeStyleChangedWithLatestStyle = (spreadsheetEditorManager) => {
  const selectedCells = spreadsheetEditorManager.getSelectedCells();
  const style = selectedCells.length > 0 ? selectedCells[0].getStyle() : {};
  const updatedStyleObject = getStyleObjectFromCellStyle(style);
  spreadsheetEditorManager.trigger('selectedRangeStyleChanged', updatedStyleObject);
};

export default triggerSelectedRangeStyleChangedWithLatestStyle;
