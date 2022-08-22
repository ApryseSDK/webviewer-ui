import getHashParameters from 'helpers/getHashParameters';
import core from 'core';
import getWiseflowCustomValues from 'helpers/getWiseflowCustomValues';
import fireEvent from 'src/helpers/fireEvent';
import Events from 'src/constants/events';
import { setAnnotationShareType } from 'src/helpers/annotationShareType';
import getAnnotationManager from 'core/getAnnotationManager';
import ShareTypes from 'src/constants/shareTypes';

export default () => (annotations, action, info) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }

  const selectAnnotationOnCreation = getHashParameters('selectAnnotationOnCreation', false);
  if (selectAnnotationOnCreation) {
    if (action === 'add' && !info.imported) {
      if (annotations.length > 0 && !annotations[0].InReplyTo) {
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

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies(), { 'imported': false, 'force': true });
  });
};
