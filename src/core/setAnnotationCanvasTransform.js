/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 */
export default (annotCanvasContext, zoom, rotation) => {
  window.documentViewer.getAnnotationManager().setAnnotationCanvasTransform(annotCanvasContext, zoom, rotation);
};
