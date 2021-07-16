import actions from 'actions';

export default dispatch => () => {
  const canUndo = window.documentViewer.getAnnotationHistoryManager().canUndo();
  dispatch(actions.setCanUndo(canUndo));
  const canRedo = window.documentViewer.getAnnotationHistoryManager().canRedo();
  dispatch(actions.setCanRedo(canRedo));
};
