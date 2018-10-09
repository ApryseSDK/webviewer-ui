/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#zoomToMouse__anchor
 * @fires fitModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:fitModeUpdated__anchor
 * @fires zoomUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:zoomUpdated__anchor
 */
export default zoomFactor =>  {
  window.docViewer.zoomToMouse(zoomFactor, 0, 0);
};
