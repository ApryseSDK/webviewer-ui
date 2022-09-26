import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.Document.html#getBookmarks__anchor
 */
export default (callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getDocument().getBookmarks().then((outlines) => {
    callback(outlines);
  });
};
