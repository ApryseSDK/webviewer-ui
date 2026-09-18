import actions from 'actions';
import { isSpreadsheetEditorMode } from 'helpers/spreadsheetEditor/isSpreadsheetEditorMode';

export const onDocumentLoadingStarted = (dispatch, documentViewerKey = null) => () => {
  dispatch(actions.openDocumentLoadingScreen(documentViewerKey));
};

export const onDocumentUIReady = (dispatch, documentViewerKey = null) => () => {
  if (!isSpreadsheetEditorMode()) {
    dispatch(actions.closeDocumentLoadingScreen(documentViewerKey));
  }
};
