/**
 * https://www.pdftron.com/api/web/Core.Document.html#getBookmarks__anchor
 */
export default callback => {
  window.documentViewer.getDocument().getBookmarks().then(outlines => {
    callback(outlines);
  });
};
