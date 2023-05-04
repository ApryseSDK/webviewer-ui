import getHashParameters from 'helpers/getHashParameters';
import core from 'core';
import getWiseflowCustomValues from 'helpers/getWiseflowCustomValues';
import fireEvent from 'src/helpers/fireEvent';
import Events from 'src/constants/events';
import { setAnnotationShareType } from 'src/helpers/annotationShareType';

export default (documentViewerKey) => (annotations, action, info) => {
  if (action === 'delete') {
    deleteReplies(annotations, documentViewerKey, info);
  }

  const selectAnnotationOnCreation = getHashParameters('selectAnnotationOnCreation', true);
  if (selectAnnotationOnCreation) {
    if (action === 'add' && !info.imported) {
      const isFreeTextAnnot = annotations[0] instanceof window.Core.Annotations.FreeTextAnnotation;
      if (annotations.length > 0 && !annotations[0].InReplyTo && !isFreeTextAnnot) {
        core.selectAnnotation(annotations[0]);
      }
    }
  }

  // CUSTOM WISEFLOW
  // Add default share type
  const { defaultShareType } = getWiseflowCustomValues();
  if (defaultShareType && action === 'add' && !info.imported && !info.isUndoRedo) {
    annotations = annotations.map(annot => setAnnotationShareType(annot, defaultShareType));
  }

  // Call custom WISEFLOW_ANNOTATION_CHANGED event
  if (!info.imported) {
    fireEvent(Events.WISEFLOW_ANNOTATION_CHANGED, {
      action,
      info,
      annotations,
    });
  }
};

const deleteReplies = (annotations, documentViewerKey, info) => {
  annotations.forEach((annotation) => {
    core.deleteAnnotations(annotation.getReplies(), { 'imported': false, 'force': true, 'isUndoRedo': info?.isUndoRedo }, documentViewerKey);
  });
};
