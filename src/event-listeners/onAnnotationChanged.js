import core from 'core';


export default () => (annotations, action) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }

  if (action === 'add') {
    if (annotations.length > 0 && !annotations[0].__inReplyTo) {
      core.selectAnnotation(annotations[0]);
    }
  }
};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies(), false, true);
  });
};
