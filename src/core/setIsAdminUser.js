/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setIsAdminUser__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default isAdmin => {
  if (isAdmin) {
    window.documentViewer.getAnnotationManager().promoteUserToAdmin();
  } else {
    window.documentViewer.getAnnotationManager().demoteUserFromAdmin();
  }
};
