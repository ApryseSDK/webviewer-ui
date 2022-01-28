/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#addAnnotations__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default annotations => {
  window.documentViewer.getAnnotationManager().addAnnotations(annotations);
};
