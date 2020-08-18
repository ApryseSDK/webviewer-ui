import getHashParams from 'helpers/getHashParams';
import core from 'core';


export default () => (annotations, action, info) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }

  const selectAnnotationOnCreation =
    getHashParams('selectAnnotationsOnCreation', true);
  if (selectAnnotationOnCreation) {
    if (action === 'add' && !info.imported) {
      if (annotations.length > 0 && !annotations[0].__inReplyTo) {
        core.selectAnnotation(annotations[0]);
      }
    }
  }

};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies(), false, true);
  });
};
