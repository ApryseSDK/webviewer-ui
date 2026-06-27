import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#canModifyContents__anchor
 */
export default (annotation, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().canModifyContents(annotation);
