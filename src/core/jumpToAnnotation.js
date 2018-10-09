/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#jumpToAnnotationd__anchor
 */
export default annotation =>  {
  window.docViewer.getAnnotationManager().jumpToAnnotation(annotation);
};
