/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#drawAnnotations__anchor
 */
export default (pageNumber, overrideCanvas, majorRedraw, overrideContainer) =>
  window.documentViewer
    .getAnnotationManager()
    .drawAnnotations(
      pageNumber,
      overrideCanvas,
      majorRedraw,
      overrideContainer,
    );
