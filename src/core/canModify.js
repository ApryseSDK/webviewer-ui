import core from 'core';

/**
 * Whether or not the current user can modify the annotation.
 */
export default (annotation, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().canModify(annotation);
