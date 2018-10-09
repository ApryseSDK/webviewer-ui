/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setIsAdminUser__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default isAdmin =>  {
  window.docViewer.getAnnotationManager().setIsAdminUser(isAdmin);
};
