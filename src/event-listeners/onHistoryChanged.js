import actions from 'actions';
import core from 'core';

export default (dispatch, documentViewerKey) => () => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const canUndo = documentViewer.getAnnotationHistoryManager().canUndo();
  dispatch(actions.setCanUndo(canUndo, documentViewerKey));
  const canRedo = documentViewer.getAnnotationHistoryManager().canRedo();
  dispatch(actions.setCanRedo(canRedo, documentViewerKey));
};
