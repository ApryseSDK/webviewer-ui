import { SPREADSHEET_SHEET_INDEX_KEY, SPREADSHEET_ROW_KEY, SPREADSHEET_COLUMN_KEY } from 'constants/spreadsheetEditor';

/**
 * Finds the existing comment thread's root note at a spreadsheet cell, if any.
 * @param {object} params
 * @param {Array} params.notes All top-level notes/annotations in the current document.
 * @param {number} params.activeSheetIndex The sheet index the cell belongs to.
 * @param {number} params.topLeftRow The 0-based row index of the cell.
 * @param {number} params.topLeftColumn The 0-based column index of the cell.
 * @returns {object|undefined} The matching note, if one exists.
 * @ignore
 */
const findExistingSpreadsheetCommentAtCell = ({ notes, activeSheetIndex, topLeftRow, topLeftColumn }) => {
  if (topLeftRow == null || topLeftColumn == null) {
    return undefined;
  }

  const parseCustomDataInt = (note, key) => Number.parseInt(note.getCustomData(key), 10) || 0;

  return notes.find((note) => (
    parseCustomDataInt(note, SPREADSHEET_SHEET_INDEX_KEY) === activeSheetIndex
    && parseCustomDataInt(note, SPREADSHEET_ROW_KEY) === topLeftRow
    && parseCustomDataInt(note, SPREADSHEET_COLUMN_KEY) === topLeftColumn
  ));
};

export default findExistingSpreadsheetCommentAtCell;
