/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setAnnotationStyles__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, callback) => {
  window.documentViewer.getAnnotationManager().setAnnotationStyles(annotation, callback);
};
