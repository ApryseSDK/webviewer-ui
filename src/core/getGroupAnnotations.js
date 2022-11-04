import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#getGroupAnnotations__anchor
 */
export default (annotation, documentViewerKey = 1) => {
  return core.getDocumentViewer(documentViewerKey).getAnnotationManager().getGroupAnnotations(annotation);
};
