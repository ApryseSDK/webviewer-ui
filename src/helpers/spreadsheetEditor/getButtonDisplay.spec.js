import getButtonDisplay from './getButtonDisplay';
import core from 'core';

jest.mock('core');

describe('getButtonDisplay', () => {
  let mockSpreadsheetEditorManager;
  let mockDocumentViewer;

  beforeEach(() => {
    mockSpreadsheetEditorManager = {
      getSelectedCells: jest.fn(),
      getSelectedCellRange: jest.fn(),
    };

    mockDocumentViewer = {
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    };

    core.getDocumentViewer = jest.fn(() => mockDocumentViewer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show always-show buttons for single cell', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([{}]);
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue({
      firstRow: 0,
      lastRow: 0,
      firstColumn: 0,
      lastColumn: 0,
    });

    const result = getButtonDisplay();
    expect(result.None).toBe(true);
    expect(result.Top).toBe(true);
    expect(result.Left).toBe(true);
    expect(result.Right).toBe(true);
    expect(result.Bottom).toBe(true);
    expect(result.Outside).toBe(true);
  });

  it('should hide conditional buttons for single cell', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([{}]);
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue({
      firstRow: 0,
      lastRow: 0,
      firstColumn: 0,
      lastColumn: 0,
    });

    const result = getButtonDisplay();
    expect(result.All).toBe(false);
    expect(result.Inside).toBe(false);
    expect(result.Vertical).toBe(false);
    expect(result.Horizontal).toBe(false);
  });

  it('should show showForMultipleCells buttons for multiple cells', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([{}, {}]);
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue({
      firstRow: 0,
      lastRow: 1,
      firstColumn: 0,
      lastColumn: 1,
    });

    const result = getButtonDisplay();
    expect(result.All).toBe(true);
    expect(result.Outside).toBe(true);
  });

  it('should hide Horizontal and Inside for single row', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([{}, {}, {}]);
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue({
      firstRow: 0,
      lastRow: 0,
      firstColumn: 0,
      lastColumn: 2,
    });

    const result = getButtonDisplay();
    expect(result.All).toBe(true);
    expect(result.Outside).toBe(true);
    expect(result.Vertical).toBe(true);
    expect(result.Horizontal).toBe(false);
    expect(result.Inside).toBe(false);
  });

  it('should hide Vertical and Inside for single column', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([{}, {}, {}]);
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue({
      firstRow: 0,
      lastRow: 2,
      firstColumn: 0,
      lastColumn: 0,
    });

    const result = getButtonDisplay();
    expect(result.All).toBe(true);
    expect(result.Outside).toBe(true);
    expect(result.Horizontal).toBe(true);
    expect(result.Vertical).toBe(false);
    expect(result.Inside).toBe(false);
  });

  it('should show all buttons for multi-row multi-column selection', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([{}, {}, {}, {}]);
    mockSpreadsheetEditorManager.getSelectedCellRange.mockReturnValue({
      firstRow: 0,
      lastRow: 2,
      firstColumn: 0,
      lastColumn: 2,
    });

    const result = getButtonDisplay();
    expect(result.All).toBe(true);
    expect(result.Outside).toBe(true);
    expect(result.Inside).toBe(true);
    expect(result.Vertical).toBe(true);
    expect(result.Horizontal).toBe(true);
  });

});
