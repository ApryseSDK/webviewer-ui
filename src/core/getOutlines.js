import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#getBookmarks__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getDocument().getBookmarks().then((outlines) => {
    callback(outlines);
  });
};
