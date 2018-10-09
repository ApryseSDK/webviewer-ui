/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setDisplayMode__anchor
 * @fires displayModeUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:displayModeUpdated__anchor
 * @fires zoomUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:zoomUpdated__anchor
 */
export default mode => {
  const displayMode = new window.CoreControls.DisplayMode(window.docViewer, mode);

  window.docViewer.getDisplayModeManager().setDisplayMode(displayMode);
};
