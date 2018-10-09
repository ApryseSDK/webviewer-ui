/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#setFitMode__anchor
 * @fires fitModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:fitModeUpdated__anchor
 * @fires zoomUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:zoomUpdated__anchor
 */
export default () => {
  window.docViewer.setFitMode(window.docViewer.FitMode.FitPage);
};
