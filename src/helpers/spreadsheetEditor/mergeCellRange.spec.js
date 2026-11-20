import mergeCellRange from './mergeCellRange';
import core from 'core';

jest.mock('core');

describe('mergeCellRange', () => {
  let mockSpreadsheetEditorManager;
  let mockDocumentViewer;

  beforeEach(() => {
    mockSpreadsheetEditorManager = {
      setSelectedCellsStyle: jest.fn(),
    };

    mockDocumentViewer = {
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    };

    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should merge cells with merge object', () => {
    const mergeObj = { firstRow: 0, firstColumn: 0, lastRow: 1, lastColumn: 1 };
    mergeCellRange(mergeObj);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      merge: mergeObj,
    });
  });

  it('should handle null merge object', () => {
    mergeCellRange(null);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      merge: null,
    });
  });

});
