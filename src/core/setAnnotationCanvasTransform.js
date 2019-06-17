/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 */
export default (annotCanvasContext, zoom, rotation) => {
  if (window.docViewer.getAnnotationManager().setAnnotationCanvasTransform) {
    window.docViewer.getAnnotationManager().setAnnotationCanvasTransform(annotCanvasContext, zoom, rotation);
  }
};
