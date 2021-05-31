/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#jumpToAnnotationd__anchor
 */
export default annotation => {
  window.documentViewer.getAnnotationManager().jumpToAnnotation(annotation);
};
