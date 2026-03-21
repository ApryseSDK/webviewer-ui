import core from 'core';

const changeDisplayMode = (mode, documentViewer) => {
  const displayModeManager = documentViewer.getDisplayModeManager();
  const currentDisplayMode = displayModeManager.getDisplayMode();
  let currentMode;
  if (currentDisplayMode &&
    !(typeof currentDisplayMode === 'string' || typeof currentDisplayMode === 'number')
    && 'mode' in currentDisplayMode) {
    currentMode = currentDisplayMode.mode;
  } else {
    currentMode = currentDisplayMode;
  }
  if (currentMode !== mode) {
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

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setDisplayMode__anchor
 * @fires displayModeUpdated on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:displayModeUpdated__anchor
 * @fires zoomUpdated on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:zoomUpdated__anchor
 */
export default (mode, documentViewerKey = null) => {
  if (documentViewerKey === null) {
    for (const documentViewer of core.getDocumentViewers()) {
      changeDisplayMode(mode, documentViewer);
    }
  } else {
    const documentViewer = core.getDocumentViewer(documentViewerKey);
    changeDisplayMode(mode, documentViewer);
  }
};
