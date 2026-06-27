import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setCurrentUser__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default (userName, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().setCurrentUser(userName);
};
