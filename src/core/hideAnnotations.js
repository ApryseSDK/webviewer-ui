/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#hideAnnotations__anchor
 */
export default annotations =>  {
  return window.docViewer.getAnnotationManager().hideAnnotations(annotations);
};
