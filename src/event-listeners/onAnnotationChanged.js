import core from 'core';

export default () => (annotations, action) => {
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
