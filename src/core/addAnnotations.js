import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#addAnnotations__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotations, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().addAnnotations(annotations);
};
