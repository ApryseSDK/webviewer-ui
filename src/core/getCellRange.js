export default (cellRangeString) => {
  const cellRangeCoordinates = new window.Core.SpreadsheetEditor.CellRange.parseRangeString(cellRangeString);
  return new window.Core.SpreadsheetEditor.CellRange(cellRangeCoordinates);
};