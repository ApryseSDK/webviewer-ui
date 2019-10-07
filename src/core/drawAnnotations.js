/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#drawAnnotations__anchor
 */
export default (pageNumber, overrideCanvas, majorRedraw, overrideContainer) =>
  window.docViewer
    .getAnnotationManager()
    .drawAnnotations(
      pageNumber,
      overrideCanvas,
      majorRedraw,
      overrideContainer,
    );
