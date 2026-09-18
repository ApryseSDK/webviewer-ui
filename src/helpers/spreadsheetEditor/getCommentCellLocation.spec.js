import getCommentCellLocation from './getCommentCellLocation';

describe('getCommentCellLocation', () => {
  const getSheetAt = jest.fn((index) => ({ name: 'Sheet1' }));
  const getWorkbook = jest.fn(() => ({
    activeSheetIndex: 0,
    getSheetAt,
  }));

  const spreadsheetEditorManager = { getWorkbook };

  beforeEach(() => {
    jest.clearAllMocks();
    getWorkbook.mockImplementation(() => ({
      activeSheetIndex: 0,
      getSheetAt,
    }));
    getSheetAt.mockImplementation(() => ({ name: 'Sheet1' }));
  });

  it('returns null when the manager is missing', () => {
    expect(getCommentCellLocation(undefined, 'A1')).toBeNull();
  });

  it('returns null when the active range is missing', () => {
    expect(getCommentCellLocation(spreadsheetEditorManager, undefined)).toBeNull();
    expect(getCommentCellLocation(spreadsheetEditorManager, null)).toBeNull();
    expect(getCommentCellLocation(spreadsheetEditorManager, '')).toBeNull();
  });

  it('returns null when the workbook is missing', () => {
    getWorkbook.mockReturnValue(undefined);
    expect(getCommentCellLocation(spreadsheetEditorManager, 'A1')).toBeNull();
  });

  it('returns null when the active sheet is missing', () => {
    getSheetAt.mockReturnValue(undefined);
    expect(getCommentCellLocation(spreadsheetEditorManager, 'A1')).toBeNull();
  });

  it('returns null when the sheet name is missing', () => {
    getSheetAt.mockReturnValue({ name: '' });
    expect(getCommentCellLocation(spreadsheetEditorManager, 'A1')).toBeNull();
  });

  it('returns null when the selected range starts with an empty cell', () => {
    expect(getCommentCellLocation(spreadsheetEditorManager, ':C3')).toBeNull();
  });

  it('returns the selected cell for a single-cell range', () => {
    expect(getCommentCellLocation(spreadsheetEditorManager, 'B3')).toEqual({
      sheetName: 'Sheet1',
      cellString: 'B3',
    });
  });

  it('returns the top-left cell for a range', () => {
    expect(getCommentCellLocation(spreadsheetEditorManager, 'A1:C3')).toEqual({
      sheetName: 'Sheet1',
      cellString: 'A1',
    });
  });
});