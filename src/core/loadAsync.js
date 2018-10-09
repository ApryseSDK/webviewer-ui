/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#loadAsync__anchor
 */
export default (partRetriever, docOptions) =>  {
  window.docViewer.loadAsync(partRetriever, docOptions);
};
