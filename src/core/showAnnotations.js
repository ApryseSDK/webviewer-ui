import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#showAnnotations__anchor
 */
export default (annotations, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().showAnnotations(annotations);
