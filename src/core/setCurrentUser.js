import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setCurrentUser__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default (userName, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().setCurrentUser(userName);
};
