import core from 'core';

export default () => (e, annotations, action) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }
};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies());
  });
};
