/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#loadAsync__anchor
 */
export default (partRetriever, docOptions) => {
  window.documentViewer.loadAsync(partRetriever, docOptions);
};
