import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#isAnnotationSelected__anchor
 */
export default (annotation, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().isAnnotationSelected(annotation);
