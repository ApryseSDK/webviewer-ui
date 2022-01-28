/**
 * https://www.pdftron.com/api/web/Coret.html#loadThumbnailAsync__anchor
 * RequestId will be used if we cancel that thumbnail loading
 */
export default (pageNum, callback) => {
  const requestId = window.documentViewer.getDocument().loadThumbnailAsync(pageNum, thumb => {
    callback(thumb);
  });
  return requestId;
};
