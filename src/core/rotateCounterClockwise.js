/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#rotateCounterClockwise__anchor
 * @fires fitModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:fitModeUpdated__anchor
 * @fires zoomUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:zoomUpdated__anchor
 */
export default () => {
  window.documentViewer.rotateCounterClockwise();
};
