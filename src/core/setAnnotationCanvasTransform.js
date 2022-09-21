import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 */
export default (annotCanvasContext, zoom, rotation, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().setAnnotationCanvasTransform(annotCanvasContext, zoom, rotation);
};
