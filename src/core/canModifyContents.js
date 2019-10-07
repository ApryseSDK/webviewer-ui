/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#canModifyContents__anchor
 */
export default annotation =>
  window.docViewer.getAnnotationManager().canModifyContents(annotation);
