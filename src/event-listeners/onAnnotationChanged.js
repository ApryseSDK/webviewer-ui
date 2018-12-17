import core from 'core';

export default () => (e, annotations, action) => {
  if (action === 'delete') {
    annotations.forEach(annotation => {
      core.deleteAnnotations(annotation.getReplies());
    });
  }
};
