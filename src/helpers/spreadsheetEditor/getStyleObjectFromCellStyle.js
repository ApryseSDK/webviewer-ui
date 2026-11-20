/**
 * @ignore
 * Convert a cell style object to a plain object suitable for use in UI updates.
 * @param {Core.SpreadsheetEditor.CellStyle} cellStyle
 * @returns {Object} - The cell style as a plain object
 */
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

export default getStyleObjectFromCellStyle;
