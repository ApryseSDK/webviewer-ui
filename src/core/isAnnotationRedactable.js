import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#isAnnotationRedactable__anchor
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:isAnnotationRedactable__anchor
 */
export default (annotations, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().isAnnotationRedactable(annotations);
