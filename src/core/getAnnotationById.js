import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#getAnnotationById__anchor
 */
export default (Id, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().getAnnotationById(Id);
