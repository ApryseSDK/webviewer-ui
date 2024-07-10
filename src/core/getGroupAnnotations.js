import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getGroupAnnotations__anchor
 */
export default (annotation, documentViewerKey = 1) => {
  return core.getDocumentViewer(documentViewerKey).getAnnotationManager().getGroupAnnotations(annotation);
};
