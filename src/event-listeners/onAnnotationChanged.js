import core from 'core';
import actions from 'actions';

export default dispatch => (annotations, action) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }
};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies(), false, true);
  });
};
