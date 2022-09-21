import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#updateCopiedAnnotations__anchor
 */
export default (documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().updateCopiedAnnotations();
};
