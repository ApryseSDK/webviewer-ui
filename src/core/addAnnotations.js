/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#addAnnotations__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationChanged__anchor
 */
export default annotations =>  {
  window.docViewer.getAnnotationManager().addAnnotations(annotations);
};
