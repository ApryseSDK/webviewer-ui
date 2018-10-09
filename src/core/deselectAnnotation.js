/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#deselectAnnotation__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationSelected__anchor
 */
export default annotation =>  {
  window.docViewer.getAnnotationManager().deselectAnnotation(annotation);
};
