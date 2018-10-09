/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#loadThumbnailAsync__anchor
 * RequestId will be used if we cancel that thumbnail loading
 */
export default (index, callback) => {
  const requestId = window.docViewer.getDocument().loadThumbnailAsync(index, thumb => {
    callback(thumb);
  });
  return requestId;
};
