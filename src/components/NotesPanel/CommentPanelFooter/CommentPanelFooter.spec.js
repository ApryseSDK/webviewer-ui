import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentPanelFooter from './CommentPanelFooter';
import core from 'core';
import DataElements from 'constants/dataElement';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
  getOfficeEditor: jest.fn(),
  getAnnotationById: jest.fn(),
  selectAnnotation: jest.fn(),
  deselectAllAnnotations: jest.fn(),
}));

const buildStore = (state, dispatchedActions = []) => configureStore({
  reducer: (currentState = state, action) => {
    dispatchedActions.push(action);
    return state;
  },
});

const renderCommentPanelFooter = (props, state, dispatchedActions = []) => {
  render(
    <Provider store={buildStore(state, dispatchedActions)}>
      <CommentPanelFooter {...props} />
    </Provider>
  );
  return dispatchedActions;
};

const officeEditorState = (stream) => ({
  viewer: {
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {},
  },
  officeEditor: { stream },
  spreadsheetEditor: {
    activeCellRange: '',
    cellProperties: { isSingleCell: false },
  },
});

const spreadsheetEditorState = ({ activeCellRange = 'B3', isSingleCell = true } = {}) => ({
  viewer: {
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {},
  },
  officeEditor: { stream: null },
  spreadsheetEditor: {
    activeCellRange,
    cellProperties: { isSingleCell },
  },
});

describe('CommentPanelFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Office Editor comment panel', () => {
    it('enables Add Comment when the active stream is BODY', () => {
      const { BODY } = window.Core.Document.OfficeEditor.EditingStreamType;
      renderCommentPanelFooter({ dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL }, officeEditorState(BODY));

      expect(screen.getByRole('button', { name: 'Add Comment' })).toBeEnabled();
    });

    it('disables Add Comment when the active stream is not BODY', () => {
      const { HEADER } = window.Core.Document.OfficeEditor.EditingStreamType;
      renderCommentPanelFooter({ dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL }, officeEditorState(HEADER));

      expect(screen.getByRole('button', { name: 'Add Comment' })).toBeDisabled();
    });

    it('creates a comment thread at the current range when clicked', async () => {
      const addCommentThreadAtCurrentRange = jest.fn().mockResolvedValue();
      core.getOfficeEditor.mockReturnValue({
        getCommentManager: () => ({ addCommentThreadAtCurrentRange }),
      });
      const { BODY } = window.Core.Document.OfficeEditor.EditingStreamType;
      renderCommentPanelFooter({ dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL }, officeEditorState(BODY));

      await userEvent.click(screen.getByRole('button', { name: 'Add Comment' }));

      expect(addCommentThreadAtCurrentRange).toHaveBeenCalledWith('');
    });
  });

  describe('Spreadsheet Editor comment panel', () => {
    const setUpSpreadsheetCore = ({ addComment, sheetName = 'Sheet1', activeSheetIndex = 0 } = {}) => {
      const commentManager = { addComment };
      const workbook = {
        activeSheetIndex,
        getSheetAt: jest.fn(() => ({ name: sheetName })),
      };
      const spreadsheetEditorManager = {
        getWorkbook: jest.fn(() => workbook),
        getCommentManager: jest.fn(() => commentManager),
      };
      core.getDocumentViewer.mockReturnValue({
        getSpreadsheetEditorManager: jest.fn(() => spreadsheetEditorManager),
      });
      return { commentManager, workbook, spreadsheetEditorManager };
    };

    it('is enabled when multiple cells are selected', () => {
      setUpSpreadsheetCore({ addComment: jest.fn() });
      renderCommentPanelFooter(
        { dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL, existingCommentAtSelectedCell: false },
        spreadsheetEditorState({ activeCellRange: 'A1:B2', isSingleCell: false }),
      );

      expect(screen.getByRole('button', { name: 'Add Comment' })).toBeEnabled();
    });

    it('is enabled and calls the add-reply stub when a comment already exists at the selected cell', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const addComment = jest.fn();
      setUpSpreadsheetCore({ addComment });
      const existingComment = { getId: () => 'existing-comment-id' };

      renderCommentPanelFooter(
        { dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL, existingCommentAtSelectedCell: existingComment },
        spreadsheetEditorState(),
      );

      const button = screen.getByRole('button', { name: 'Add Comment' });
      expect(button).toBeEnabled();

      await userEvent.click(button);

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('addReply'), existingComment);
      expect(addComment).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('creates a comment at the selected cell, selects it, and triggers note editing on success', async () => {
      const newAnnotation = { Id: 'new-comment-id' };
      const addComment = jest.fn(() => ({ getId: () => 'new-comment-id' }));
      setUpSpreadsheetCore({ addComment, sheetName: 'Sheet1' });
      core.getAnnotationById.mockReturnValue(newAnnotation);

      const dispatchedActions = renderCommentPanelFooter(
        { dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL, existingCommentAtSelectedCell: false },
        spreadsheetEditorState({ activeCellRange: 'B3' }),
      );

      await userEvent.click(screen.getByRole('button', { name: 'Add Comment' }));

      await waitFor(() => expect(addComment).toHaveBeenCalledWith('', { sheetName: 'Sheet1', cellString: 'B3' }));
      expect(core.selectAnnotation).toHaveBeenCalledWith(newAnnotation, 1);
      expect(dispatchedActions.some((action) => action.type === 'SET_NOTE_EDITING')).toBe(true);
    });

    it('uses the top-left cell of a range selection', async () => {
      const addComment = jest.fn(() => ({ getId: () => 'new-comment-id' }));
      setUpSpreadsheetCore({ addComment });
      core.getAnnotationById.mockReturnValue({ Id: 'new-comment-id' });

      renderCommentPanelFooter(
        { dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL, existingCommentAtSelectedCell: false },
        spreadsheetEditorState({ activeCellRange: 'A1:B2', isSingleCell: false }),
      );

      await userEvent.click(screen.getByRole('button', { name: 'Add Comment' }));

      await waitFor(() => expect(addComment).toHaveBeenCalledWith('', { sheetName: 'Sheet1', cellString: 'A1' }));
    });

    it('logs and recovers when the create request fails', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const addComment = jest.fn(() => {
        throw new Error('LT engine failure');
      });
      setUpSpreadsheetCore({ addComment });

      renderCommentPanelFooter(
        { dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL, existingCommentAtSelectedCell: false },
        spreadsheetEditorState(),
      );

      const button = screen.getByRole('button', { name: 'Add Comment' });
      await userEvent.click(button);

      await waitFor(() => expect(consoleWarnSpy).toHaveBeenCalled());
      expect(core.selectAnnotation).not.toHaveBeenCalled();
      expect(button).toBeEnabled();

      consoleWarnSpy.mockRestore();
    });
  });
});
