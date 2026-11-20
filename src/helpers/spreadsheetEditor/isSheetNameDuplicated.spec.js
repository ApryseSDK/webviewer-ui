import { isSheetNameDuplicated } from './isSheetNameDuplicated';

describe('isSheetNameDuplicated', () => {
  const currentSheet = { sheetIndex: 0, name: 'Sheet1' };

  it('should return false when name is not duplicated', () => {
    const sheets = [
      { sheetIndex: 0, name: 'Sheet1' },
      { sheetIndex: 1, name: 'Sheet2' },
    ];
    const result = isSheetNameDuplicated(sheets, currentSheet, 'Sheet3');
    expect(result).toBe(false);
  });

  it('should return true when name is duplicated in another sheet', () => {
    const sheets = [
      { sheetIndex: 0, name: 'Sheet1' },
      { sheetIndex: 1, name: 'Sheet2' },
    ];
    const result = isSheetNameDuplicated(sheets, currentSheet, 'Sheet2');
    expect(result).toBe(true);
  });

  it('should return false when name matches current sheet', () => {
    const sheets = [
      { sheetIndex: 0, name: 'Sheet1' },
      { sheetIndex: 1, name: 'Sheet2' },
    ];
    const result = isSheetNameDuplicated(sheets, currentSheet, 'Sheet1');
    expect(result).toBe(false);
  });

  it('should be case-insensitive', () => {
    const sheets = [
      { sheetIndex: 0, name: 'Sheet1' },
      { sheetIndex: 1, name: 'sheet2' },
    ];
    const result = isSheetNameDuplicated(sheets, currentSheet, 'SHEET2');
    expect(result).toBe(true);
  });

  it('should return false for empty sheets array', () => {
    const result = isSheetNameDuplicated([], currentSheet, 'Sheet1');
    expect(result).toBe(false);
  });

});
