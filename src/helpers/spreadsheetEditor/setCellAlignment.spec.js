import setCellAlignment from './setCellAlignment';
import core from 'core';

jest.mock('core');

describe('setCellAlignment', () => {
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

  it('should set horizontalAlignment left style', () => {
    setCellAlignment('left');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      horizontalAlignment: 1,
    });
  });

  it('should set horizontalAlignment center style', () => {
    setCellAlignment('center');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      horizontalAlignment: 2,
    });
  });

  it('should set horizontalAlignment right style', () => {
    setCellAlignment('right');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      horizontalAlignment: 3,
    });
  });

  it('should set verticalAlignment top style', () => {
    setCellAlignment('top');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      verticalAlignment: 1,
    });
  });

  it('should set verticalAlignment middle style', () => {
    setCellAlignment('middle');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      verticalAlignment: 2,
    });
  });

  it('should set verticalAlignment bottom style', () => {
    setCellAlignment('bottom');
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
      verticalAlignment: 3,
    });
  });

  it.each([null, undefined])('should not set a style when alignmentType is %p', (alignmentType) => {
    setCellAlignment(alignmentType);
    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).not.toHaveBeenCalled();
  });
});
