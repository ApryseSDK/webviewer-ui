import setCellAlignment, { getAlignmentProperties } from './setCellAlignment';
import core from 'core';

// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('getAlignmentProperties', () => {
  const testCases = [
    { input: 'left', expected: { alignment: 'horizontalAlignment', alignmentValue: 1 } },
    { input: 'center', expected: { alignment: 'horizontalAlignment', alignmentValue: 2 } },
    { input: 'right', expected: { alignment: 'horizontalAlignment', alignmentValue: 3 } },
    { input: 'alignTopButton', expected: { alignment: 'verticalAlignment', alignmentValue: 1 } },
    { input: 'alignMiddleButton', expected: { alignment: 'verticalAlignment', alignmentValue: 2 } },
    { input: 'alignBottomButton', expected: { alignment: 'verticalAlignment', alignmentValue: 3 } },
    { input: 'invalidType', expected: { alignment: undefined, alignmentValue: undefined } },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should return correct alignment properties for "${input}"`, () => {
      expect(getAlignmentProperties(input)).toEqual(expected);
    });
  });
});

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => ({
      getSelectedCellRange: jest.fn(),
      getSelectedCells: jest.fn(),
    })),
  })),
}));

describe('setCellAlignment', () => {
  let mockSpreadsheetEditorManager;
  let mockCells;

  beforeEach(() => {
    mockCells = [
      {
        getStyle: jest.fn(() => ({})),
        setStyle: jest.fn(),
      },
      {
        getStyle: jest.fn(() => ({})),
        setStyle: jest.fn(),
      },
    ];

    mockSpreadsheetEditorManager = {
      getSelectedCellRange: jest.fn(),
      getSelectedCells: jest.fn(() => mockCells),
    };

    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    });
  });

  // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
  it.skip('should apply horizontal alignment to selected cells', () => {
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue(true);

    setCellAlignment('left');

    mockCells.forEach((cell) => {
      expect(cell.getStyle).toHaveBeenCalled();
      expect(cell.setStyle).toHaveBeenCalledWith({
        horizontalAlignment: 1,
      });
    });
  });

  // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
  it.skip('should apply vertical alignment to selected cells', () => {
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue(true);

    setCellAlignment('alignTopButton');

    mockCells.forEach((cell) => {
      expect(cell.getStyle).toHaveBeenCalled();
      expect(cell.setStyle).toHaveBeenCalledWith({
        verticalAlignment: 1,
      });
    });
  });

  // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
  it.skip('should log a warning if no cell range is selected', () => {
    mockCells = [];
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue(null);

    setCellAlignment('left');

    expect(consoleWarnSpy).toHaveBeenCalledWith('Please make a selection on the sheet.');
    consoleWarnSpy.mockRestore();
  });

  it('should do nothing if alignmentType is not provided', () => {
    setCellAlignment();

    expect(mockSpreadsheetEditorManager.getSelectedCellRange).not.toHaveBeenCalled();
    expect(mockSpreadsheetEditorManager.getSelectedCells).not.toHaveBeenCalled();
  });
});