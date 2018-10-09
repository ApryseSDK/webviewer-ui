/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#cancelLoadThumbnail__anchor
 */
export default requestId => {
  window.docViewer.getDocument().cancelLoadThumbnail(requestId);
};