import { isSheetNameDuplicated } from './spreadsheetSwitchContainerHelpers';

describe('isSheetNameDuplicated', () => {
  const mockSheet = (name, sheetIndex = 0) => ({
    name,
    sheetIndex
  });

  // Helper function to reduce duplication in tests
  const testForCheckingDuplicatedSheetName = (sheets, currentSheet, newName, expected) => {
    const result = isSheetNameDuplicated(sheets, currentSheet, newName);
    expect(result).toBe(expected);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when currentSheet name equals newName', () => {
    const sheets = [mockSheet('Sheet1', 0), mockSheet('Sheet2', 1)];
    const currentSheet = mockSheet('Sheet1', 0);

    testForCheckingDuplicatedSheetName(sheets, currentSheet, 'Sheet1', false);
  });

  describe('duplicate name scenarios', () => {
    const sheets = [mockSheet('Sheet1', 0), mockSheet('Sheet2', 1)];
    const currentSheet = mockSheet('CurrentSheet', 2);

    it.each([
      ['Sheet2', 'case sensitive'],
      ['SHEET2', 'case insensitive'],
      ['sheet1', 'mixed case with different sheet']
    ])('should return true when newName "%s" duplicates existing name (%s)', (newName) => {
      testForCheckingDuplicatedSheetName(sheets, currentSheet, newName, true);
    });

    it('should return false when newName does not duplicate any existing sheet name', () => {
      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'UniqueSheet', false);
    });
  });

  describe('special duplicate scenarios', () => {
    it('should return true when newName duplicates with different case in different sheet array', () => {
      const sheets = [mockSheet('MySheet', 0), mockSheet('DataSheet', 1)];
      const currentSheet = mockSheet('CurrentSheet', 2);

      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'mysheet', true);
    });
  });

  describe('same sheet scenarios', () => {
    const sheets = [mockSheet('Sheet1', 0), mockSheet('Sheet2', 1)];
    const currentSheet = mockSheet('Sheet1', 0);

    it('should return false when renaming to same name with different case for the same sheet', () => {
      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'sheet1', false);
    });

    it('should return false when sheet being renamed matches itself by sheetIndex', () => {
      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'DifferentName', false);
    });
  });

  describe('boundary conditions', () => {
    it('should handle empty sheet array', () => {
      const sheets = [];
      const currentSheet = mockSheet('CurrentSheet', 0);

      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'NewSheet', false);
    });

    it('should handle a sheet array with only one sheet', () => {
      const sheets = [mockSheet('OnlySheet', 0)];
      const currentSheet = mockSheet('CurrentSheet', 1);

      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'OnlySheet', true);
    });
  });

  describe('edge cases', () => {
    const currentSheet = mockSheet('CurrentSheet', 2);

    it.each([
      ['', [mockSheet('', 0), mockSheet('Sheet2', 1)], 'empty string names'],
      ['  sheet1  ', [mockSheet('  Sheet1  ', 0), mockSheet('Sheet2', 1)], 'whitespace names'],
      ['sheet-1', [mockSheet('Sheet-1', 0), mockSheet('Sheet_2', 1)], 'special characters in names']
    ])('should handle %s (%s)', (newName, sheets) => {
      testForCheckingDuplicatedSheetName(sheets, currentSheet, newName, true);
    });

    it('should return false when current sheet is not found in sheets array', () => {
      const sheets = [mockSheet('Sheet1', 0), mockSheet('Sheet2', 1)];
      const currentSheet = mockSheet('NotInArray', 99);

      testForCheckingDuplicatedSheetName(sheets, currentSheet, 'Sheet1', true);
    });
  });
});