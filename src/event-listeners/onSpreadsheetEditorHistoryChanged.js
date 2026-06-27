import core from 'core';
import actions from 'actions';

export default (dispatch, documentViewerKey) => () => {
  const spreadsheetEditorManager = core.getDocumentViewer(documentViewerKey).getSpreadsheetEditorManager();
  const spreadsheetEditorHistoryManager = spreadsheetEditorManager.getSpreadsheetEditorHistoryManager();
  const canUndo = spreadsheetEditorHistoryManager.canUndo();
  const canRedo = spreadsheetEditorHistoryManager.canRedo();
  dispatch(actions.setSpreadsheetEditorCanUndo(canUndo));
  dispatch(actions.setSpreadsheetEditorCanRedo(canRedo));
};