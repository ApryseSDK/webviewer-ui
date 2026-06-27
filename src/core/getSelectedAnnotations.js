import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getSelectedAnnotations__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getSelectedAnnotations();
