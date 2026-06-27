import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getZoom__anchor
 */
export default (documentViewerKey) => {
  if (!core.hasDocumentViewer(documentViewerKey)) {
    return undefined;
  }
  return core.getDocumentViewer(documentViewerKey).getZoomLevel();
};
