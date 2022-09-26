import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#jumpToAnnotationd__anchor
 */
export default (annotation, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().jumpToAnnotation(annotation);
