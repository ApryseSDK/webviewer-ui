import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#loadThumbnailAsync
 * RequestId will be used if we cancel that thumbnail loading
 */
export default (pageNum, callback, documentViewerKey = 1) => {
  const requestId = core.getDocumentViewer(documentViewerKey).getDocument().loadThumbnail(pageNum, (thumb) => {
    callback(thumb);
  });
  return requestId;
};
