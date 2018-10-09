/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#selectAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationSelected__anchor
 */
export default annotations =>  {
  window.docViewer.getAnnotationManager().selectAnnotations(annotations);
};
