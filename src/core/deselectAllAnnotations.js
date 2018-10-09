/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#deselectAllAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationSelected__anchor
 */
export default () =>  {
  window.docViewer.getAnnotationManager().deselectAllAnnotations();
};
