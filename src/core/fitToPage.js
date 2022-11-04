import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setFitMode__anchor
 * @fires fitModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:fitModeUpdated__anchor
 * @fires zoomUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:zoomUpdated__anchor
 */
export default (documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setFitMode(core.getDocumentViewer(documentViewerKey).FitMode.FitPage);
};
