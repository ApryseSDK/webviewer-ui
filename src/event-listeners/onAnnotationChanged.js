import getHashParameters from 'helpers/getHashParameters';
import core from 'core';


export default (documentViewerKey) => (annotations, action, info) => {
  if (action === 'delete') {
    deleteReplies(annotations, documentViewerKey);
  }

  const selectAnnotationOnCreation = getHashParameters('selectAnnotationOnCreation', false);
  if (selectAnnotationOnCreation) {
    if (action === 'add' && !info.imported) {
      if (annotations.length > 0 && !annotations[0].InReplyTo) {
        core.selectAnnotation(annotations[0], documentViewerKey);
      }
    }
  }
};

const deleteReplies = (annotations, documentViewerKey) => {
  annotations.forEach((annotation) => {
    core.deleteAnnotations(annotation.getReplies(), { 'imported': false, 'force': true }, documentViewerKey);
  });
};
