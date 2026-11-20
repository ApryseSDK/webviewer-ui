import getSelectedCellStyle from './getSelectedCellStyle';
import core from 'core';

jest.mock('core');

describe('getSelectedCellStyle', () => {
  let mockCell;
  let mockCellStyle;
  let mockSpreadsheetEditorManager;
  let mockDocumentViewer;

  beforeEach(() => {
    mockCellStyle = { color: 'red' };

    mockCell = {
      getStyle: jest.fn(() => mockCellStyle),
    };

    mockSpreadsheetEditorManager = {
      getSelectedCells: jest.fn(() => [mockCell]),
    };

    mockDocumentViewer = {
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    };

    core.hasDocumentViewer = jest.fn(() => true);
    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cell style when cell is selected', () => {
    const result = getSelectedCellStyle();
    expect(result).toEqual(mockCellStyle);
  });

  it('should return null when no cells are selected', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([]);
    const result = getSelectedCellStyle();
    expect(result).toBeNull();
  });

  it('should return style of first cell when multiple cells are selected', () => {
    const secondCell = {
      getStyle: jest.fn(() => ({ color: 'blue' })),
    };
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([mockCell, secondCell]);
    const result = getSelectedCellStyle();
    expect(result).toEqual(mockCellStyle);
  });

  it('should return undefined when document viewer is not available', () => {
    core.hasDocumentViewer.mockReturnValue(false);
    const result = getSelectedCellStyle();
    expect(result).toBeUndefined();
  });

});
