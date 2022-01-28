/**
 * https://www.pdftron.com/api/web/Core.Document.html#cancelLoadThumbnail__anchor
 */
export default requestId => {
  window.documentViewer.getDocument().cancelLoadThumbnail(requestId);
};