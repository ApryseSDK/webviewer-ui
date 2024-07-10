import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setIsAdminUser__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default (isAdmin) => {
  const documentViewers = core.getDocumentViewers();
  if (isAdmin) {
    documentViewers.forEach((documentViewer) => documentViewer.getAnnotationManager().promoteUserToAdmin());
  } else {
    documentViewers.forEach((documentViewer) => documentViewer.getAnnotationManager().demoteUserFromAdmin());
  }
};
