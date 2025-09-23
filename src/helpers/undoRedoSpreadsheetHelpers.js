export const getStyleObjectFromCellStyle = (cellStyle) => {
  if (!cellStyle) {
    return {};
  }
  return {
    backgroundColor: cellStyle.backgroundColor? cellStyle.backgroundColor : '',
    verticalAlignment: cellStyle.verticalAlignment,
    horizontalAlignment: cellStyle.horizontalAlignment,
    font: {
      bold: cellStyle.font.bold,
      italic: cellStyle.font.italic,
      underline: cellStyle.font.underline,
      color: cellStyle.font.color,
      pointSize: cellStyle.font.pointSize,
      fontFace: cellStyle.font.fontFace,
      strikeout: cellStyle.font.strikeout,
    },
    wrapText: cellStyle.wrapText,
    formatString: cellStyle.getDataFormatString() ? cellStyle.getDataFormatString() : '',
  };
};

/**
 * @ignore
 * This function is used after undo/redo to trigger the 'selectedRangeStyleChanged' event with the latest style
 * so that the UI can be updated accordingly.
 * This will likely be removed in the future when proper event flow for undo/redo is implemented.
 * @param {*} spreadsheetEditorManager
 */
export const triggerSelectedRangeStyleChangedWithLatestStyle = (spreadsheetEditorManager) => {
  const selectedCells = spreadsheetEditorManager.getSelectedCells();
  const style = selectedCells.length > 0 ? selectedCells[0].getStyle() : {};
  const updatedStyleObject = getStyleObjectFromCellStyle(style);
  spreadsheetEditorManager.trigger('selectedRangeStyleChanged', updatedStyleObject);
};