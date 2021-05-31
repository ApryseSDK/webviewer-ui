/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#selectAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 */
export default annotations => {
  window.documentViewer.getAnnotationManager().selectAnnotations(annotations);
};
