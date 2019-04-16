/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:setAnnotationCanvasTransform__anchor
 */
export default (annotCanvasContext, zoom, rotation) => {
    window.docViewer.getAnnotationManager().setAnnotationCanvasTransform(annotCanvasContext, zoom, rotation);
};
