/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setReadOnly__anchor
 * @fires updateAnnotationPermission on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:updateAnnotationPermission__anchor
 */
export default isReadOnly =>  {
  window.docViewer.getAnnotationManager().setReadOnly(isReadOnly);  
};
