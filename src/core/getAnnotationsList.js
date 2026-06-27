import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getAnnotationsList__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationsList();
