import core from 'core';

/**
 * https://www.pdftron.com/api/web/Coret.html#loadThumbnailAsync__anchor
 * RequestId will be used if we cancel that thumbnail loading
 */
export default (pageNum, callback, documentViewerKey = 1) => {
  const requestId = core.getDocumentViewer(documentViewerKey).getDocument().loadThumbnail(pageNum, (thumb) => {
    callback(thumb);
  });
  return requestId;
};
