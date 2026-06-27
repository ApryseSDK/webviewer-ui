import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#drawAnnotations__anchor
 */
export default (pageNumber, overrideCanvas, majorRedraw, overrideContainer, documentViewerKey) => core.getDocumentViewer(documentViewerKey)
  .getAnnotationManager()
  .drawAnnotations(
    pageNumber,
    overrideCanvas,
    majorRedraw,
    overrideContainer,
  );
