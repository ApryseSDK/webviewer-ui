import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setDisplayMode__anchor
 * @fires displayModeUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:displayModeUpdated__anchor
 * @fires zoomUpdated on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:zoomUpdated__anchor
 */
export default (mode) => {
  for (const documentViewer of core.getDocumentViewers()) {
    const displayModeManager = documentViewer.getDisplayModeManager();
    const displayMode = (displayModeManager.isVirtualDisplayEnabled())
      ? new window.Core.VirtualDisplayMode(documentViewer, mode)
      : new window.Core.DisplayMode(documentViewer, mode);

    displayModeManager.setDisplayMode(displayMode);
  }
};
