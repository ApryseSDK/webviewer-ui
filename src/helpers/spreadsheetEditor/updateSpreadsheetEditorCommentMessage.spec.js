import updateSpreadsheetEditorCommentMessage from './updateSpreadsheetEditorCommentMessage';

describe('updateSpreadsheetEditorCommentMessage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call setCommentMessage with annotation.Id and the replacement text', () => {
    const setCommentMessage = jest.fn();
    const coreMock = {
      getDocumentViewer: () => ({
        getSpreadsheetEditorManager: () => ({
          getCommentManager: () => ({ setCommentMessage }),
        }),
      }),
    };

    const didUpdate = updateSpreadsheetEditorCommentMessage({
      annotation: { Id: 'sse-comment-id-1' },
      text: 'Updated comment',
      core: coreMock,
    });

    expect(setCommentMessage).toHaveBeenCalledWith('sse-comment-id-1', 'Updated comment');
    expect(didUpdate).toBe(true);
  });

  it('should return false and warn when setCommentMessage throws', () => {
    const error = new Error('Update failed');
    const setCommentMessage = jest.fn(() => {
      throw error;
    });
    const coreMock = {
      getDocumentViewer: () => ({
        getSpreadsheetEditorManager: () => ({
          getCommentManager: () => ({ setCommentMessage }),
        }),
      }),
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const didUpdate = updateSpreadsheetEditorCommentMessage({
      annotation: { Id: 'sse-comment-id-1' },
      text: 'Updated comment',
      core: coreMock,
    });

    expect(didUpdate).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to update spreadsheet editor comment message (id: sse-comment-id-1)',
      error,
    );
  });
});
