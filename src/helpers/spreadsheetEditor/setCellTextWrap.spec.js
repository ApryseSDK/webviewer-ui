import setCellTextWrap from './setCellTextWrap';
import core from 'core';

jest.mock('core');

describe('setCellTextWrap', () => {
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

  it('should set text wrap overflow', () => {
    setCellTextWrap('overflow');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      wrapText: 1,
    });
  });

  it('should set text wrap wrap', () => {
    setCellTextWrap('wrap');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      wrapText: 2,
    });
  });

  it('should set text wrap clip', () => {
    setCellTextWrap('clip');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      wrapText: 3,
    });
  });

  it.each([null, undefined, ''])('should return early if wrapTextType is %p', (wrapTextType) => {
    setCellTextWrap(wrapTextType);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).not.toHaveBeenCalled();
  });
});
