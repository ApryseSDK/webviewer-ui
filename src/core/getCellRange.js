export default (cellRangeString) => {
  const cellRangeCoordinates = window.Core.SpreadsheetEditor.CellRange.parseRangeString(cellRangeString);
  return new window.Core.SpreadsheetEditor.CellRange(cellRangeCoordinates);
};