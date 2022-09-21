import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#deselectAnnotation__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 */
export default (annotation, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().deselectAnnotation(annotation);
};
