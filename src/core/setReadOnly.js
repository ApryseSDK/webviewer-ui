/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setReadOnly__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default isReadOnly => {
  if (isReadOnly) {
    window.documentViewer.getAnnotationManager().enableReadOnlyMode();
  } else {
    window.documentViewer.getAnnotationManager().disableReadOnlyMode();
  }
};
