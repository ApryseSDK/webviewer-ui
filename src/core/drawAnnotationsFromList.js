/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#drawAnnotationsFromList__anchor
 */
export default annotations =>  {
  window.docViewer.getAnnotationManager().drawAnnotationsFromList(annotations);
};
