/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setAnnotationStyles__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, callback) =>  {
  window.docViewer.getAnnotationManager().setAnnotationStyles(annotation, callback);
};
