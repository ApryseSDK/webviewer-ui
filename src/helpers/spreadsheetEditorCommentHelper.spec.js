import { deleteSpreadsheetEditorComment } from './spreadsheetEditorCommentHelper';

describe('deleteSpreadsheetEditorComment', () => {
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
    warnSpy.mockRestore();
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
    warnSpy.mockRestore();
  });
});
