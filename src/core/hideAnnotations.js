import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#hideAnnotations__anchor
 */
export default (annotations, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().hideAnnotations(annotations);
