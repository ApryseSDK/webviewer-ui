import core from 'core';
import getSelectedCellsAlignment from './getSelectedCellsAlignment';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => ({
      getCellsFromSelectedRange: jest.fn(),
    })),
  })),
}));

describe('getSelectedCellsAlignment', () => {
  let mockSpreadsheetEditorManager;
  let mockCells;

  beforeEach(() => {
    mockCells = [
      {
        getStyle: jest.fn(() => ({
          verticalAlignment: 1,
          horizontalAlignment: 2,
        })),
      },
    ];

    mockSpreadsheetEditorManager = {
      getCellsFromSelectedRange: jest.fn(() => mockCells),
    };

    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    });
  });

  it('should return the correct vertical and horizontal alignment', () => {
    const result = getSelectedCellsAlignment();

    expect(result).toEqual({
      verticalAlignment: 'alignTopButton',
      horizontalAlignment: 'center',
    });
  });

  it('should return undefined if no cells are selected', () => {
    mockSpreadsheetEditorManager.getCellsFromSelectedRange.mockReturnValue([]);

    const result = getSelectedCellsAlignment();

    expect(result).toBeUndefined();
  });
});