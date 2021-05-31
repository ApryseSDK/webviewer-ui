/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#hideAnnotations__anchor
 */
export default annotations =>
  window.documentViewer.getAnnotationManager().hideAnnotations(annotations);
