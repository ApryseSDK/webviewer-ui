import core from 'core';

/**
 * Whether or not the current user can modify the annotation.
 */
export default (annotation, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().canModify(annotation);
