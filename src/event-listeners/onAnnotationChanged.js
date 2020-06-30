import core from 'core';

export default (/* dispatch */) => (annotations, action) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }
};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies(), false, true);
  });
};
