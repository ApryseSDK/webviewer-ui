/**
 * Returns an object containing the sheet name and cell position (e.g. 'A1') indicating where the comment is positioned.
 * The top-left position is returned if a cell range is provided.
 * @returns An object containing sheet name and cell position. Returns null if either sheet name or cell string is not defined.
 * @ignore
 */
const getCommentCellLocation = (spreadsheetEditorManager, activeCellRange) => {
  if (!spreadsheetEditorManager || typeof activeCellRange !== 'string' || !activeCellRange) {
    return null;
  }

  const workbook = spreadsheetEditorManager?.getWorkbook();
  const sheetName = workbook?.getSheetAt(workbook.activeSheetIndex)?.name;
  const cellString = activeCellRange?.split(':')[0];

  if (!sheetName || !cellString) {
    return null;
  }

  return {
    sheetName,
    cellString,
  };
};

export default getCommentCellLocation;