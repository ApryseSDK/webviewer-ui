import getTotalPages from './getTotalPages';
import core from 'core';

jest.mock('core', () => ({
  getDocument: jest.fn(),
  getDocumentViewer: jest.fn(),
}));

describe('getTotalPages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns page count from document viewer in non-spreadsheet mode', () => {
    const getPageCount = jest.fn(() => 7);

    core.getDocument.mockReturnValue({
      getType: () => 'pdf',
    });
    core.getDocumentViewer.mockReturnValue({
      getPageCount,
    });

    expect(getTotalPages(2)).toBe(7);
    expect(core.getDocument).toHaveBeenCalledWith(2);
    expect(core.getDocumentViewer).toHaveBeenCalledWith(2);
    expect(getPageCount).toHaveBeenCalledTimes(1);
  });

  it('returns workbook sheet count in spreadsheet mode', () => {
    core.getDocument.mockReturnValue({
      getType: () => 'spreadsheetEditor',
    });
    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: () => ({
        getWorkbook: () => ({
          sheetCount: 5,
        }),
      }),
    });

    expect(getTotalPages()).toBe(5);
  });

  it('returns 0 when spreadsheet workbook is not ready yet', () => {
    core.getDocument.mockReturnValue({
      getType: () => 'spreadsheetEditor',
    });
    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: () => ({
        getWorkbook: () => undefined,
      }),
    });

    expect(getTotalPages()).toBe(0);
  });

  it('returns 0 when spreadsheet editor document is unavailable', () => {
    core.getDocument.mockReturnValue({
      getType: () => 'spreadsheetEditor',
    });

    expect(getTotalPages()).toBe(0);
  });
});
