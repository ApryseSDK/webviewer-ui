import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#setAnnotationCanvasTransform__anchor
 */
export default (annotCanvasContext, zoom, rotation, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().setAnnotationCanvasTransform(annotCanvasContext, zoom, rotation);
};
