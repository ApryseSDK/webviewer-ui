import {
  deleteSpreadsheetEditorComment,
  navigateToSpreadsheetComment,
} from './spreadsheetEditorCommentHelper';

describe('navigateToSpreadsheetComment', () => {
  const setActiveSheet = jest.fn();
  const selectCellRange = jest.fn();
  const getCellRange = jest.fn((cell) => ({ cell }));
  const getSheetAt = jest.fn(() => ({}));
  const core = {
    getDocumentViewer: () => ({
      getSpreadsheetEditorManager: () => ({
        getWorkbook: () => ({
          activeSheetIndex: 0,
          getSheetAt,
          setActiveSheet,
        }),
        selectCellRange,
      }),
    }),
    getCellRange,
  };

  beforeEach(() => {
    setActiveSheet.mockClear();
    selectCellRange.mockClear();
    getCellRange.mockReset().mockImplementation((cell) => ({ cell }));
    getSheetAt.mockReset().mockReturnValue({});
  });

  it('should switch sheets and select the comment cell', () => {
    const comment = {
      getCustomData: (key) => ({
        spreadsheetSheetIndex: '1',
        spreadsheetCell: 'D5',
      }[key]),
    };

    navigateToSpreadsheetComment({ comment, core, documentViewerKey: 1 });

    expect(setActiveSheet).toHaveBeenCalledWith(1);
    expect(getCellRange).toHaveBeenCalledWith('D5');
    expect(selectCellRange).toHaveBeenCalledWith({ cell: 'D5' });
  });

  it('should warn and not navigate when the sheet or cell is invalid', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    getSheetAt.mockReturnValue(null);
    const comment = { Id: 'comment-1', getCustomData: () => null };

    navigateToSpreadsheetComment({ comment, core, documentViewerKey: 1 });

    expect(selectCellRange).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to navigate to spreadsheet editor comment (id: comment-1) due to invalid sheet or cell data',
    );
    warnSpy.mockRestore();
  });
});

describe('deleteSpreadsheetEditorComment', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call deleteComment with annotation.Id', async () => {
    const deleteComment = jest.fn(() => undefined);
    const coreMock = {
      getDocumentViewer: () => ({
        getSpreadsheetEditorManager: () => ({
          getCommentManager: () => ({
            deleteComment,
          }),
        }),
      }),
    };
    const annotation = { Id: 'sse-comment-id-1' };

    await deleteSpreadsheetEditorComment({ annotation, core: coreMock });

    expect(deleteComment).toHaveBeenCalledWith('sse-comment-id-1');
  });

  it('should warn and return early when annotation is missing', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await deleteSpreadsheetEditorComment({ annotation: null, core: {} });

    expect(warnSpy).toHaveBeenCalledWith('Missing annotation for spreadsheet editor comment deletion');
  });

  it('should return early when annotation.Id is null', async () => {
    const deleteComment = jest.fn();
    const coreMock = {
      getDocumentViewer: () => ({
        getSpreadsheetEditorManager: () => ({
          getCommentManager: () => ({ deleteComment }),
        }),
      }),
    };

    await deleteSpreadsheetEditorComment({ annotation: { Id: null }, core: coreMock });

    expect(deleteComment).not.toHaveBeenCalled();
  });

  it('should warn when deleteComment throws', async () => {
    const error = new Error('Delete failed');
    const deleteComment = jest.fn(() => {
      throw error;
    });
    const coreMock = {
      getDocumentViewer: () => ({
        getSpreadsheetEditorManager: () => ({
          getCommentManager: () => ({ deleteComment }),
        }),
      }),
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await deleteSpreadsheetEditorComment({ annotation: { Id: 'id-1' }, core: coreMock });

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to delete spreadsheet editor comment (id: id-1)',
      error,
    );
  });
});
