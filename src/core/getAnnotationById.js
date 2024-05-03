import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#getAnnotationById__anchor
 */
export default (Id, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationById(Id);
