import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#selectAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 */
export default (annotations, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().selectAnnotations(annotations);
};
