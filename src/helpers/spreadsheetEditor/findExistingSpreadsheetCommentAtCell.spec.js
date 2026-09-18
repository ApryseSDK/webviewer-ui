import findExistingSpreadsheetCommentAtCell from './findExistingSpreadsheetCommentAtCell';
import { SPREADSHEET_SHEET_INDEX_KEY, SPREADSHEET_ROW_KEY, SPREADSHEET_COLUMN_KEY } from 'constants/spreadsheetEditor';

const createNote = ({ id, sheetIndex, row, column }) => ({
  id,
  getCustomData: (key) => {
    switch (key) {
      case SPREADSHEET_SHEET_INDEX_KEY:
        return String(sheetIndex);
      case SPREADSHEET_ROW_KEY:
        return String(row);
      case SPREADSHEET_COLUMN_KEY:
        return String(column);
      default:
        return undefined;
    }
  },
});

describe('findExistingSpreadsheetCommentAtCell', () => {
  it('returns the note matching sheet index, row, and column', () => {
    const match = createNote({ id: 'match', sheetIndex: 1, row: 2, column: 3 });
    const notes = [
      createNote({ id: 'other-sheet', sheetIndex: 0, row: 2, column: 3 }),
      match,
      createNote({ id: 'other-cell', sheetIndex: 1, row: 5, column: 3 }),
    ];

    const result = findExistingSpreadsheetCommentAtCell({
      notes,
      activeSheetIndex: 1,
      topLeftRow: 2,
      topLeftColumn: 3,
    });

    expect(result).toBe(match);
  });

  it('returns undefined when no note matches the cell', () => {
    const notes = [createNote({ id: 'a', sheetIndex: 0, row: 0, column: 0 })];

    const result = findExistingSpreadsheetCommentAtCell({
      notes,
      activeSheetIndex: 1,
      topLeftRow: 2,
      topLeftColumn: 3,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined when topLeftRow is null', () => {
    const notes = [createNote({ id: 'a', sheetIndex: 0, row: 0, column: 0 })];

    const result = findExistingSpreadsheetCommentAtCell({
      notes,
      activeSheetIndex: 0,
      topLeftRow: null,
      topLeftColumn: 0,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined when topLeftColumn is null', () => {
    const notes = [createNote({ id: 'a', sheetIndex: 0, row: 0, column: 0 })];

    const result = findExistingSpreadsheetCommentAtCell({
      notes,
      activeSheetIndex: 0,
      topLeftRow: 0,
      topLeftColumn: null,
    });

    expect(result).toBeUndefined();
  });

  it('treats a note with unparseable custom data as being at row/column/sheet 0', () => {
    const zeroedNote = createNote({ id: 'zeroed', sheetIndex: NaN, row: NaN, column: NaN });

    const result = findExistingSpreadsheetCommentAtCell({
      notes: [zeroedNote],
      activeSheetIndex: 0,
      topLeftRow: 0,
      topLeftColumn: 0,
    });

    expect(result).toBe(zeroedNote);
  });
});
