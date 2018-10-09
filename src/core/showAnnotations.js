/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#showAnnotations__anchor
 */
export default annotations =>  {
  return window.docViewer.getAnnotationManager().showAnnotations(annotations);
};
