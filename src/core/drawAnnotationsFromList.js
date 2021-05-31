/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#drawAnnotationsFromList__anchor
 */
export default annotations => {
  window.documentViewer.getAnnotationManager().drawAnnotationsFromList(annotations);
};
