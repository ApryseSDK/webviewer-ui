import core from 'core';
import actions from 'actions';

export default dispatch => (annotations, action) => {
  // const canUndo= window.docViewer.getAnnotationHistoryManager().canUndo();
  // dispatch(actions.setCanUndo(canUndo));
  // const canRedo = window.docViewer.getAnnotationHistoryManager().canRedo();
  // dispatch(actions.setCanRedo(canRedo));

  if (action === 'delete') {
    deleteReplies(annotations);
  }
};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies(), false, true);
  });
};
