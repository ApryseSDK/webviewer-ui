import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setDisplayMode__anchor
 * @fires displayModeUpdated on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:displayModeUpdated__anchor
 * @fires zoomUpdated on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:zoomUpdated__anchor
 */
export default (mode) => {
  for (const documentViewer of core.getDocumentViewers()) {
    const displayModeManager = documentViewer.getDisplayModeManager();
    const displayMode = (displayModeManager.isVirtualDisplayEnabled())
      ? new window.Core.VirtualDisplayMode(documentViewer, mode)
      : new window.Core.DisplayMode(documentViewer, mode);

    displayModeManager.setDisplayMode(displayMode);

    const currentPage = documentViewer.getCurrentPage();
    const documentTextDirection = documentViewer.getDocument()?.getPageTextDirection(currentPage);
    const isRightToLeftPageRenderingEnabled = documentViewer.isRightToLeftPageRenderingEnabled();
    if (documentTextDirection === window.Core.TextDirection['RightToLeft'] && !isRightToLeftPageRenderingEnabled) {
      documentViewer.enableRightToLeftPageRendering();
    } else if (documentTextDirection === window.Core.TextDirection['LeftToRight'] && isRightToLeftPageRenderingEnabled) {
      documentViewer.disableRightToLeftPageRendering();
    }
  }
};
