/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#canModifyContents__anchor
 */
export default annotation =>
  window.documentViewer.getAnnotationManager().canModifyContents(annotation);
