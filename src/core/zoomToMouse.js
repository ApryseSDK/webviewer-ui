import core from 'core';
import getZoomToMouseOffsets from 'helpers/getZoomToMouseOffsets';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#zoomToMouse__anchor
 * @fires fitModeUpdated on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:fitModeUpdated__anchor
 * @fires zoomUpdated on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:zoomUpdated__anchor
 */
export default (zoomFactor, documentViewerKey, mouseEvent) => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const { xOffset, yOffset } = getZoomToMouseOffsets(documentViewer, mouseEvent);
  documentViewer.zoomToMouse(zoomFactor, xOffset, yOffset, mouseEvent);
};
