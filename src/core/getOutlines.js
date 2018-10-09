/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#getBookmarks__anchor
 */
export default callback => {
  window.docViewer.getDocument().getBookmarks().then(outlines => {
    callback(outlines);
  });
};
