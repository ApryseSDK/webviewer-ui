import actions from 'actions';

export default dispatch => () => {
  const canUndo = window.docViewer.getAnnotationHistoryManager().canUndo();
  dispatch(actions.setCanUndo(canUndo));
  const canRedo = window.docViewer.getAnnotationHistoryManager().canRedo();
  dispatch(actions.setCanRedo(canRedo));
};
