/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setDisplayMode__anchor
 * @fires displayModeUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:displayModeUpdated__anchor
 * @fires zoomUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:zoomUpdated__anchor
 */
export default mode => {
  const displayMode = new window.Core.DisplayMode(window.documentViewer, mode);

  window.documentViewer.getDisplayModeManager().setDisplayMode(displayMode);
};
