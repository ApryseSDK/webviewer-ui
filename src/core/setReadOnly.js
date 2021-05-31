/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setReadOnly__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default isReadOnly => {
  window.documentViewer.getAnnotationManager().setReadOnly(isReadOnly);
};
