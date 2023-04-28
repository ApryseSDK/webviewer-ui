import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getAnnotationsList__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationsList();
