/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setDisplayMode__anchor
 * @fires displayModeUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:displayModeUpdated__anchor
 * @fires zoomUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:zoomUpdated__anchor
 */
export default mode => {
  const displayModeManager = window.documentViewer.getDisplayModeManager();
  const displayMode = (displayModeManager.isVirtualDisplayEnabled())
    ? new window.Core.VirtualDisplayMode(window.documentViewer, mode)
    : new window.Core.DisplayMode(window.documentViewer, mode);

  displayModeManager.setDisplayMode(displayMode);
};
